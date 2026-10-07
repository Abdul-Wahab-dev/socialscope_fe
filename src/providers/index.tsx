'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryCacheProvider } from '@/lib/query';
import { AuthProvider } from './auth-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryCacheProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryCacheProvider>
  );
}
