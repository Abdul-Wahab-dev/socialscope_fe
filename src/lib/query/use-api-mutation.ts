'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toAppError, type AppError } from '@/lib/api-error';

export interface UseApiMutationOptions<TData, TVars> {
  mutationFn: (variables: TVars) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVars) => unknown;
  onError?: (error: AppError, variables: TVars) => unknown;
  onSettled?: (data: TData | undefined, error: AppError | null, variables: TVars) => unknown;
}

export interface ApiMutationResult<TData, TVars> {
  /** Fire-and-forget: errors go to onError and `error`, never thrown */
  mutate: (variables: TVars) => void;
  /** Awaitable version that rethrows the AppError */
  mutateAsync: (variables: TVars) => Promise<TData>;
  reset: () => void;
  data: TData | undefined;
  error: AppError | null;
  variables: TVars | undefined;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

type Status = 'idle' | 'pending' | 'success' | 'error';

export function useApiMutation<TData, TVars = void>(options: UseApiMutationOptions<TData, TVars>): ApiMutationResult<TData, TVars> {
  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [state, setState] = useState<{ status: Status; data?: TData; error: AppError | null; variables?: TVars }>({ status: 'idle', error: null });
  const callId = useRef(0); // only the latest call updates state

  const mutateAsync = useCallback(async (variables: TVars) => {
    const id = ++callId.current;
    setState({ status: 'pending', error: null, variables });
    const { mutationFn, onSuccess, onError, onSettled } = optsRef.current;
    try {
      const data = await mutationFn(variables);
      if (mounted.current && id === callId.current) setState({ status: 'success', data, error: null, variables });
      await onSuccess?.(data, variables);
      await onSettled?.(data, null, variables);
      return data;
    } catch (raw) {
      const error = toAppError(raw);
      if (mounted.current && id === callId.current) setState({ status: 'error', error, variables });
      await onError?.(error, variables);
      await onSettled?.(undefined, error, variables);
      throw error;
    }
  }, []);

  const mutate = useCallback(
    (variables: TVars) => {
      mutateAsync(variables).catch(() => undefined); // handled via onError/state
    },
    [mutateAsync],
  );

  const reset = useCallback(() => setState({ status: 'idle', error: null }), []);

  return {
    mutate,
    mutateAsync,
    reset,
    data: state.data,
    error: state.error,
    variables: state.variables,
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  };
}
