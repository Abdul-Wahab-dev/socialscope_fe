'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useApiQuery, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { AUTH_EXPIRED_EVENT } from '@/lib/api-client';
import * as authService from '@/services/auth.service';
import type { User } from '@/types/user';
import type { LoginValues, RegisterPayload } from '@/validations/auth.schema';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (values: LoginValues) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryCache = useQueryCache();
  const router = useRouter();

  const { data: user = null, isLoading, refetch } = useApiQuery({
    queryKey: queryKeys.me,
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60_000,
  });

  // Refresh token rejected -> session is over
  useEffect(() => {
    const onExpired = () => {
      queryCache.setData(queryKeys.me, null);
      queryCache.remove((key) => key[0] !== 'auth' && key[0] !== 'meta');
      toast.error('Your session has expired. Please log in again.');
      router.push(`${routes.login}?next=${encodeURIComponent(window.location.pathname)}`);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [queryCache, router]);

  const login = useCallback(
    async (values: LoginValues) => {
      const res = await authService.login(values);
      queryCache.clear();
      queryCache.setData(queryKeys.me, res.user);
      return res.user;
    },
    [queryCache],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await authService.register(payload);
      queryCache.clear();
      queryCache.setData(queryKeys.me, res.user);
      return res.user;
    },
    [queryCache],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // even if the API call fails, clear local state
    }
    queryCache.clear();
    queryCache.setData(queryKeys.me, null);
    router.push(routes.home);
    router.refresh();
  }, [queryCache, router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout, refreshUser: refetch }),
    [user, isLoading, login, register, logout, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
