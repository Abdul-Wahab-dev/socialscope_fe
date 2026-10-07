'use client';

import { useApiQuery } from '@/lib/query';
import { queryKeys } from '@/constants/query-keys';
import { getCategories, getPublicConfig } from '@/services/meta.service';

export function useCategories() {
  return useApiQuery({ queryKey: queryKeys.meta.categories, queryFn: getCategories, staleTime: 60 * 60_000 });
}

export function usePublicConfig() {
  return useApiQuery({ queryKey: queryKeys.meta.config, queryFn: getPublicConfig, staleTime: 5 * 60_000 });
}

/** slug -> display name lookup */
export function useCategoryName() {
  const { data } = useCategories();
  return (slug: string) => data?.find((c) => c.slug === slug)?.name ?? slug;
}
