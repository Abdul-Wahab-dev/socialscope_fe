'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { useState } from 'react';
import { ArrowUpDown, Lock, SearchX, SlidersHorizontal, Users } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { AppError } from '@/lib/api-error';
import { saveCreator, unsaveCreator } from '@/services/brand.service';
import { getSearchQuota, searchCreators } from '@/services/search.service';
import type { CreatorCardData } from '@/types/creator';
import type { SearchFilters as Filters, SearchMeta } from '@/types/search';
import type { Paginated } from '@/types/api';
import { CreatorCard } from '@/components/creators/creator-card';
import { Button, EmptyState, ErrorState, Select, Skeleton, buttonClasses } from '@/components/ui';
import { SORT_OPTIONS } from '@/constants/options';
import type { SearchSort } from '@/types/search';
import { cn } from '@/lib/utils';
import { QuotaBanner } from './quota-banner';
import { SearchFilters } from './search-filters';
import { filtersFromParams, filtersToParams } from './search-params';

export function DiscoverView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryCache = useQueryCache();
  const { user } = useAuth();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasSearch = searchParams.toString().length > 0;
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const resultsKey = queryKeys.search.results(filters as Record<string, unknown>);

  const quotaQuery = useApiQuery({ queryKey: queryKeys.search.quota, queryFn: getSearchQuota });

  const results = useApiQuery({
    queryKey: resultsKey,
    queryFn: () => searchCreators(filters),
    enabled: hasSearch,
    keepPreviousData: true,
    staleTime: 5 * 60_000, // re-visiting the same search shouldn't refetch
  });

  // keep quota banner in sync with the latest search response
  const quota = results.data?.meta.quota ?? quotaQuery.data;

  const apply = (next: Filters) => {
    const qs = filtersToParams({ ...next, sort: next.sort ?? 'relevance' }).toString();
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const goToPage = (page: number) => {
    router.push(`${pathname}?${filtersToParams({ ...filters, page }).toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveMutation = useApiMutation({
    mutationFn: (c: CreatorCardData) => (c.isSaved ? unsaveCreator(c.id) : saveCreator(c.id)),
    onSuccess: (_d, c) => {
      queryCache.setData<Paginated<CreatorCardData, SearchMeta>>(resultsKey, (old) =>
        old ? { ...old, items: old.items.map((i) => (i.id === c.id ? { ...i, isSaved: !c.isSaved } : i)) } : old,
      );
      queryCache.invalidate(queryKeys.brand.saved);
      toast.success(c.isSaved ? 'Removed from saved' : 'Saved to your shortlist');
    },
    onError: (e) => toast.error(e.message),
  });

  const onToggleSave = (c: CreatorCardData) => {
    if (!user) {
      router.push(`${routes.login}?next=${encodeURIComponent(`${pathname}?${searchParams.toString()}`)}`);
      return;
    }
    saveMutation.mutate(c);
  };

  const error = results.error instanceof AppError ? results.error : null;

  const activeCount = [filters.q, filters.categories?.length, filters.platform, filters.country, filters.city, filters.language, filters.minFollowers ?? filters.maxFollowers, filters.minEngagement, filters.maxPrice, filters.availableOnly].filter(Boolean).length;

  let body: React.ReactNode;
  if (!hasSearch) {
    body = (
      <EmptyState
        icon={<Users />}
        title="Set your filters and hit Search"
        description="Pick a niche, platform or city on the left. Each new search uses one search from your quota; paging through results is free."
      />
    );
  } else if (error?.code === 'GUEST_SEARCH_LIMIT') {
    body = (
      <EmptyState
        icon={<Lock />}
        title="You’ve used your free guest searches"
        description={error.message}
        action={
          <Link href={`${routes.register}?role=brand`} className={buttonClasses('gradient', 'lg')}>
            Create a free account
          </Link>
        }
      />
    );
  } else if (error?.code === 'PAYMENT_REQUIRED') {
    body = (
      <EmptyState
        icon={<Lock />}
        title="Weekly searches used up"
        description={error.message}
        action={
          user?.role === 'brand' ? (
            <Link href={routes.brand.billing} className={buttonClasses('gradient', 'lg')}>
              Buy a search pack
            </Link>
          ) : undefined
        }
      />
    );
  } else if (results.isError) {
    body = <ErrorState message={results.error.message} onRetry={() => results.refetch()} />;
  } else if (results.isPending) {
    body = (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-3xl" />
        ))}
      </div>
    );
  } else if (results.data.items.length === 0) {
    body = <EmptyState icon={<SearchX />} title="No creators match these filters" description="Try widening the audience size, location or price range." />;
  } else {
    body = (
      <>
        <div className={cn('grid gap-5 transition-opacity sm:grid-cols-2 xl:grid-cols-3', results.isFetching && 'opacity-60')}>
          {results.data.items.map((c) => (
            <CreatorCard
              key={c.id}
              creator={c}
              onToggleSave={user?.role === 'creator' ? undefined : onToggleSave}
              savePending={saveMutation.isPending && saveMutation.variables?.id === c.id}
            />
          ))}
        </div>
        {results.data.meta.totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
            <Button variant="secondary" disabled={filters.page === 1 || results.isFetching} onClick={() => goToPage((filters.page ?? 1) - 1)}>
              Previous
            </Button>
            <span className="rounded-xl bg-white px-4 py-2 text-sm text-zinc-600 ring-1 ring-zinc-200">
              Page <span className="font-semibold text-zinc-950">{results.data.meta.page}</span> of {results.data.meta.totalPages}
            </span>
            <Button variant="secondary" disabled={(filters.page ?? 1) >= results.data.meta.totalPages || results.isFetching} onClick={() => goToPage((filters.page ?? 1) + 1)}>
              Next
            </Button>
          </nav>
        )}
      </>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className={cn('lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:rounded-3xl lg:no-scrollbar', !filtersOpen && 'hidden')}>
        <SearchFilters
          key={searchParams.toString()}
          value={filters}
          onApply={(f) => {
            setFiltersOpen(false);
            apply(f);
          }}
          loading={results.isFetching}
        />
      </aside>

      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" className="lg:hidden" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[11px] text-white">{activeCount}</span>}
          </Button>
          <p className="text-sm text-zinc-600">
            {hasSearch && results.data ? (
              <>
                <span className="font-semibold text-zinc-950">{results.data.meta.total.toLocaleString()}</span> creators found
              </>
            ) : (
              'Search results appear here'
            )}
          </p>
          <label className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
            <ArrowUpDown className="h-4 w-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Sort</span>
            <Select
              aria-label="Sort results"
              className="h-9 w-44 text-[13px]"
              value={filters.sort ?? 'relevance'}
              disabled={!hasSearch}
              onChange={(e) => apply({ ...filters, sort: e.target.value as SearchSort, page: 1 })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <QuotaBanner quota={quota} canBuy={user?.role === 'brand'} />
        {body}
      </div>
    </div>
  );
}
