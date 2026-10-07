'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { QueryCache } from './query-cache';

const QueryCacheContext = createContext<QueryCache | null>(null);

/** One cache per browser session (created lazily so server renders never share data). */
export function QueryCacheProvider({ children }: { children: ReactNode }) {
  const [cache] = useState(() => new QueryCache());
  return <QueryCacheContext.Provider value={cache}>{children}</QueryCacheContext.Provider>;
}

export function useQueryCache(): QueryCache {
  const cache = useContext(QueryCacheContext);
  if (!cache) throw new Error('useQueryCache must be used inside <QueryCacheProvider>');
  return cache;
}
