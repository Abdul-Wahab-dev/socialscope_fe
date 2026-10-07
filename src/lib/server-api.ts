import 'server-only';
import { serverApiUrl } from '@/config/env';
import type { ApiErrorBody, ApiSuccess } from '@/types/api';
import { AppError } from './api-error';

/** Fetch helper for Server Components (public endpoints; uses Next's fetch cache options). */
export async function serverFetch<T>(path: string, init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${serverApiUrl()}${path}`, { ...init, headers: { Accept: 'application/json', ...init?.headers } });
  } catch {
    throw new AppError({ message: 'Cannot reach the API server', code: 'NETWORK_ERROR' });
  }
  const body = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiErrorBody | null;
  if (!res.ok || !body || !body.success) {
    const err = body && !body.success ? body.error : undefined;
    throw new AppError({ message: err?.message ?? 'Request failed', status: res.status, code: err?.code, details: err?.details });
  }
  return body.data;
}
