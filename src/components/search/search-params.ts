import type { SearchFilters, SearchSort } from '@/types/search';
import type { SocialPlatform } from '@/types/creator';

const num = (v: string | null) => (v === null || v === '' || Number.isNaN(Number(v)) ? undefined : Number(v));

export function filtersFromParams(params: URLSearchParams): SearchFilters {
  return {
    q: params.get('q') || undefined,
    categories: params.get('categories')?.split(',').filter(Boolean) || undefined,
    platform: (params.get('platform') as SocialPlatform) || undefined,
    country: params.get('country') || undefined,
    city: params.get('city') || undefined,
    language: params.get('language') || undefined,
    minFollowers: num(params.get('minFollowers')),
    maxFollowers: num(params.get('maxFollowers')),
    minEngagement: num(params.get('minEngagement')),
    maxPrice: num(params.get('maxPrice')),
    availableOnly: params.get('availableOnly') === 'true' || undefined,
    sort: (params.get('sort') as SearchSort) || 'relevance',
    page: num(params.get('page')) ?? 1,
  };
}

export function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '' || value === false) continue;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else params.set(key, String(value));
  }
  if (params.get('page') === '1') params.delete('page');
  return params;
}
