'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { AppError } from '@/lib/api-error';
import { hashKey, type QueryKey, type QueryState } from './query-cache';
import { useQueryCache } from './query-provider';

export interface UseApiQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  /** Set false to skip fetching (e.g. until a value is known). Default true. */
  enabled?: boolean;
  /** How long data is considered fresh, in ms. Default 30s. */
  staleTime?: number;
  /** Poll every N ms, or decide from the current data. */
  refetchInterval?: number | false | ((data: T | undefined) => number | false);
  /** Keep showing the previous key's data while a new key loads (pagination, filters). */
  keepPreviousData?: boolean;
  /** Retries for transient (non-4xx) failures. Default 2. */
  retry?: number;
}

interface Common {
  isFetching: boolean;
  /** First load in progress (no data yet and a fetch will run) */
  isLoading: boolean;
  isPlaceholderData: boolean;
  refetch: () => Promise<void>;
}

/** Discriminated union so `if (q.isPending) … if (q.isError) …` narrows `data` to T afterwards. */
export type ApiQueryResult<T> =
  | (Common & { status: 'pending'; isPending: true; isError: false; isSuccess: false; data: undefined; error: null })
  | (Common & { status: 'error'; isPending: false; isError: true; isSuccess: false; data: T | undefined; error: AppError })
  | (Common & { status: 'success'; isPending: false; isError: false; isSuccess: true; data: T; error: null });

export function useApiQuery<T>(options: UseApiQueryOptions<T>): ApiQueryResult<T> {
  const { queryKey, enabled = true, staleTime = 30_000, refetchInterval = false, keepPreviousData = false, retry } = options;
  const cache = useQueryCache();

  // Latest queryFn without re-running effects when the caller passes an inline arrow
  const fnRef = useRef(options.queryFn);
  useEffect(() => {
    fnRef.current = options.queryFn;
  });

  // Stable key identity across renders when its contents are equal
  const keyHash = hashKey(queryKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by content hash on purpose
  const key = useMemo(() => queryKey, [keyHash]);

  const subscribe = useCallback((cb: () => void) => cache.subscribe(key, cb), [cache, key]);
  const getSnapshot = useCallback(() => cache.getState<T>(key), [cache, key]);
  const state: QueryState<T> = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const run = useCallback(() => cache.fetch(key, () => fnRef.current(), { retry }), [cache, key, retry]);

  // Register as an observer (lets invalidate() refetch us) and fetch when missing/stale
  useEffect(() => {
    if (!enabled) return;
    const stop = cache.observe(key, () => fnRef.current());
    if (cache.isStale(key, staleTime)) void run();
    return stop;
  }, [cache, key, enabled, staleTime, run]);

  // Polling
  const interval = typeof refetchInterval === 'function' ? refetchInterval(state.data) : refetchInterval;
  useEffect(() => {
    if (!enabled || !interval) return;
    const id = setInterval(() => void run(), interval);
    return () => clearInterval(id);
  }, [enabled, interval, run]);

  // Remember the last data we had (for keepPreviousData) — "adjust state while rendering" pattern
  const [lastData, setLastData] = useState<T | undefined>(undefined);
  if (state.data !== undefined && state.data !== lastData) setLastData(state.data);

  const refetch = useCallback(async () => {
    await run();
  }, [run]);

  const usePlaceholder = keepPreviousData && state.data === undefined && state.status === 'pending' && lastData !== undefined;
  const common = {
    isFetching: state.isFetching,
    isLoading: state.status === 'pending' && enabled,
    isPlaceholderData: usePlaceholder,
    refetch,
  };

  if (usePlaceholder) {
    return { ...common, status: 'success', isPending: false, isError: false, isSuccess: true, data: lastData as T, error: null };
  }
  if (state.status === 'error' && state.error) {
    return { ...common, status: 'error', isPending: false, isError: true, isSuccess: false, data: state.data, error: state.error };
  }
  if (state.status === 'success') {
    return { ...common, status: 'success', isPending: false, isError: false, isSuccess: true, data: state.data as T, error: null };
  }
  return { ...common, status: 'pending', isPending: true, isError: false, isSuccess: false, data: undefined, error: null };
}
