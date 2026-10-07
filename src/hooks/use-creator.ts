'use client';

import { useApiQuery } from '@/lib/query';
import { queryKeys } from '@/constants/query-keys';
import { getCreatorInsights, getMyCreatorProfile } from '@/services/creator.service';

export function useMyCreatorProfile() {
  return useApiQuery({ queryKey: queryKeys.creator.me, queryFn: getMyCreatorProfile });
}

export function useCreatorInsights() {
  return useApiQuery({ queryKey: queryKeys.creator.insights, queryFn: getCreatorInsights });
}
