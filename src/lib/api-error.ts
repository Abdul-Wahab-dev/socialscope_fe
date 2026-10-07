import axios from 'axios';
import type { ApiErrorBody } from '@/types/api';

/** Normalised error thrown by every service function. */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  /** field -> first message, ready for react-hook-form's setError */
  readonly fieldErrors: Record<string, string>;

  constructor(opts: { message: string; status?: number; code?: string; details?: unknown }) {
    super(opts.message);
    this.name = 'AppError';
    this.status = opts.status ?? 0;
    this.code = opts.code ?? 'UNKNOWN';
    this.details = opts.details;
    this.fieldErrors = extractFieldErrors(opts.details);
  }

  get isValidation() {
    return this.code === 'VALIDATION_ERROR';
  }
  get isUnauthorized() {
    return this.status === 401;
  }
}

function extractFieldErrors(details: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(details)) {
    for (const d of details) {
      if (d && typeof d === 'object' && 'field' in d && 'message' in d) {
        const field = String((d as { field: unknown }).field);
        if (!out[field]) out[field] = String((d as { message: unknown }).message);
      }
    }
  } else if (details && typeof details === 'object' && 'field' in details) {
    const field = String((details as { field: unknown }).field);
    out[field] = '';
  }
  return out;
}

/** Converts anything thrown (axios, network, runtime) into an AppError with a user-friendly message. */
export function toAppError(error: unknown, fallback = 'Something went wrong. Please try again.'): AppError {
  if (error instanceof AppError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return new AppError({ message: 'The request timed out. Please try again.', code: 'TIMEOUT' });
    if (!error.response) return new AppError({ message: 'Cannot reach the server. Check your connection.', code: 'NETWORK_ERROR' });

    const body = error.response.data as Partial<ApiErrorBody> | undefined;
    return new AppError({
      message: body?.error?.message ?? fallback,
      status: error.response.status,
      code: body?.error?.code ?? `HTTP_${error.response.status}`,
      details: body?.error?.details,
    });
  }

  if (error instanceof Error) return new AppError({ message: error.message || fallback });
  return new AppError({ message: fallback });
}

export const getErrorMessage = (error: unknown) => toAppError(error).message;
