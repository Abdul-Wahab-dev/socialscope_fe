import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import { cleanParams } from '@/lib/utils';
import type { ApiSuccess, Paginated } from '@/types/api';
import type { CreatorCardData } from '@/types/creator';
import type { SearchFilters, SearchMeta, SearchQuota } from '@/types/search';

export async function searchCreators(filters: SearchFilters): Promise<Paginated<CreatorCardData, SearchMeta>> {
  try {
    const params = cleanParams({ ...filters, categories: filters.categories?.join(','), availableOnly: filters.availableOnly ? 'true' : undefined });
    const { data } = await apiClient.get<ApiSuccess<CreatorCardData[], SearchMeta>>('/search/creators', { params });
    return { items: data.data, meta: data.meta! };
  } catch (error) {
    throw toAppError(error, 'Search failed');
  }
}

export async function getSearchQuota(): Promise<SearchQuota> {
  try {
    const { data } = await apiClient.get<ApiSuccess<SearchQuota>>('/search/quota');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load search quota');
  }
}
