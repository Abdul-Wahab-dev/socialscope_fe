import { AppError, toAppError } from '@/lib/api-error';

/**
 * Tiny in-house data cache (replaces TanStack Query).
 *
 * - Entries are keyed by a stable hash of an array key, e.g. ['collabs', 'list', { page: 1 }].
 * - Concurrent fetches of the same key are de-duplicated.
 * - `invalidate(prefix)` marks matching entries stale and refetches the ones on screen.
 * - Unused entries are garbage-collected after `GC_TIME_MS`.
 */

export type QueryKey = readonly unknown[];
export type QueryStatus = 'pending' | 'error' | 'success';

export interface QueryState<T = unknown> {
  status: QueryStatus;
  data: T | undefined;
  error: AppError | null;
  isFetching: boolean;
  /** epoch ms of the last successful fetch / manual set; 0 = stale */
  updatedAt: number;
}

type Fetcher = () => Promise<unknown>;

interface Entry {
  key: QueryKey;
  state: QueryState;
  listeners: Set<() => void>;
  /** Active observers (mounted hooks) and their latest fetch functions */
  observers: Map<symbol, Fetcher>;
  inFlight?: Promise<unknown>;
  gcTimer?: ReturnType<typeof setTimeout>;
}

export interface FetchOptions {
  /** Number of retries for transient (non-4xx) failures */
  retry?: number;
}

const GC_TIME_MS = 5 * 60_000;
const INITIAL_STATE: QueryState = Object.freeze({ status: 'pending', data: undefined, error: null, isFetching: false, updatedAt: 0 }) as QueryState;

/** Stable JSON: object keys sorted so { a, b } and { b, a } hash the same. */
export function hashKey(key: QueryKey): string {
  return JSON.stringify(key, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.keys(v)
          .sort()
          .reduce<Record<string, unknown>>((acc, k) => {
            if (v[k] !== undefined) acc[k] = v[k];
            return acc;
          }, {})
      : v,
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isClientError = (e: AppError) => e.status >= 400 && e.status < 500;

export class QueryCache {
  private entries = new Map<string, Entry>();

  private entry(key: QueryKey): Entry {
    const hash = hashKey(key);
    let e = this.entries.get(hash);
    if (!e) {
      e = { key, state: INITIAL_STATE, listeners: new Set(), observers: new Map() };
      this.entries.set(hash, e);
    }
    return e;
  }

  private update(e: Entry, patch: Partial<QueryState>) {
    e.state = { ...e.state, ...patch }; // new object => useSyncExternalStore re-renders
    e.listeners.forEach((l) => l());
  }

  private scheduleGc(hash: string, e: Entry) {
    clearTimeout(e.gcTimer);
    if (e.listeners.size === 0 && e.observers.size === 0) {
      e.gcTimer = setTimeout(() => {
        if (e.listeners.size === 0 && e.observers.size === 0) this.entries.delete(hash);
      }, GC_TIME_MS);
    }
  }

  getState<T>(key: QueryKey): QueryState<T> {
    return (this.entries.get(hashKey(key))?.state ?? INITIAL_STATE) as QueryState<T>;
  }

  subscribe(key: QueryKey, listener: () => void): () => void {
    const hash = hashKey(key);
    const e = this.entry(key);
    clearTimeout(e.gcTimer);
    e.listeners.add(listener);
    return () => {
      e.listeners.delete(listener);
      this.scheduleGc(hash, e);
    };
  }

  /** A mounted hook registers its fetcher so invalidations can refetch it. */
  observe(key: QueryKey, fetcher: Fetcher): () => void {
    const hash = hashKey(key);
    const e = this.entry(key);
    const id = Symbol('observer');
    clearTimeout(e.gcTimer);
    e.observers.set(id, fetcher);
    return () => {
      e.observers.delete(id);
      this.scheduleGc(hash, e);
    };
  }

  isStale(key: QueryKey, staleTime: number): boolean {
    const s = this.getState(key);
    return s.status !== 'success' || s.updatedAt === 0 || Date.now() - s.updatedAt > staleTime;
  }

  /** Runs (or joins) a fetch for `key`. Never throws: errors are stored on the entry. */
  fetch<T>(key: QueryKey, fn: () => Promise<T>, opts: FetchOptions = {}): Promise<T | undefined> {
    const e = this.entry(key);
    if (e.inFlight) return e.inFlight as Promise<T | undefined>;

    const retries = opts.retry ?? 2;
    this.update(e, { isFetching: true });

    const run = async (): Promise<T | undefined> => {
      for (let attempt = 0; ; attempt++) {
        try {
          const data = await fn();
          this.update(e, { status: 'success', data, error: null, isFetching: false, updatedAt: Date.now() });
          return data;
        } catch (raw) {
          const error = toAppError(raw);
          if (attempt < retries && !isClientError(error)) {
            await sleep(Math.min(1000 * 2 ** attempt, 8000));
            continue;
          }
          // Keep previously loaded data visible; just record the error
          this.update(e, { status: 'error', error, isFetching: false });
          return undefined;
        }
      }
    };

    const promise = run().finally(() => {
      e.inFlight = undefined;
    });
    e.inFlight = promise;
    return promise;
  }

  /** Write data directly (optimistic updates, results of a mutation). */
  setData<T>(key: QueryKey, updater: T | undefined | ((old: T | undefined) => T | undefined)) {
    const e = this.entry(key);
    const next = typeof updater === 'function' ? (updater as (old: T | undefined) => T | undefined)(e.state.data as T | undefined) : updater;
    this.update(e, { status: 'success', data: next, error: null, updatedAt: Date.now() });
    this.scheduleGc(hashKey(key), e);
  }

  /** Does `key` start with every element of `prefix`? */
  private matches(key: QueryKey, prefix: QueryKey) {
    if (prefix.length > key.length) return false;
    return prefix.every((p, i) => hashKey([p]) === hashKey([key[i]]));
  }

  /** Marks matching queries stale and refetches those currently on screen. */
  async invalidate(prefix: QueryKey): Promise<void> {
    const jobs: Promise<unknown>[] = [];
    for (const e of this.entries.values()) {
      if (!this.matches(e.key, prefix)) continue;
      e.state = { ...e.state, updatedAt: 0 };
      const fetcher = [...e.observers.values()].pop();
      if (fetcher) jobs.push(this.fetch(e.key, fetcher));
    }
    await Promise.all(jobs);
  }

  /** Removes matching entries; mounted hooks fall back to pending and refetch. */
  remove(predicate: (key: QueryKey) => boolean) {
    for (const [hash, e] of this.entries) {
      if (!predicate(e.key)) continue;
      if (e.listeners.size === 0 && e.observers.size === 0) {
        this.entries.delete(hash);
      } else {
        e.inFlight = undefined;
        this.update(e, { ...INITIAL_STATE });
      }
    }
  }

  /** Forget everything (e.g. on login/logout so no data leaks between accounts). */
  clear() {
    this.remove(() => true);
  }
}
