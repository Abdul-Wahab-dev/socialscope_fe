'use client';

import Link from 'next/link';
import { useApiQuery } from '@/lib/query';
import { ArrowRight, Bookmark, CreditCard, Gauge, Handshake, Search } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useCategories } from '@/hooks/use-meta';
import { categoryIcon } from '@/constants/category-icons';
import { formatDate, formatMoney, timeAgo } from '@/lib/utils';
import { getSavedCreators } from '@/services/brand.service';
import { getCollabs } from '@/services/collab.service';
import { getSearchQuota } from '@/services/search.service';
import { Avatar, Card, CardBody, CardHeader, EmptyState, Skeleton, buttonClasses } from '@/components/ui';
import { Stat } from '@/components/creators/stat';
import { CollabStatusBadge } from '@/components/collabs/collab-status-badge';

export function BrandOverview() {
  const { user } = useAuth();
  const quota = useApiQuery({ queryKey: queryKeys.search.quota, queryFn: getSearchQuota });
  const saved = useApiQuery({ queryKey: queryKeys.brand.saved, queryFn: getSavedCreators });
  const collabs = useApiQuery({ queryKey: queryKeys.collabs.list({ limit: 5 }), queryFn: () => getCollabs({ limit: 5 }) });
  const { data: categories = [] } = useCategories();
  const q = quota.data?.type === 'user' ? quota.data : null;

  return (
    <div className="space-y-8">
      <section className="bg-brand-gradient relative overflow-hidden rounded-3xl p-7 text-white shadow-glow sm:p-9">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/80">Brand workspace</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome, {user?.brandProfile?.companyName ?? user?.fullName}</h1>
            <p className="mt-3 max-w-lg text-white/85">Find creators, shortlist them and send collaboration briefs, all in one place.</p>
          </div>
          <Link href={routes.discover} className={buttonClasses('dark', 'lg')}>
            <Search className="h-4 w-4" /> Find creators
          </Link>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((c) => {
            const Icon = categoryIcon(c.slug);
            return (
              <Link
                key={c.slug}
                href={`${routes.discover}?categories=${c.slug}&sort=relevance`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {c.name}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quota.isPending ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <Stat label="Free searches left" value={q ? `${q.weeklyRemaining}/${q.weeklyLimit}` : '—'} icon={<Gauge />} hint={q ? `Resets ${formatDate(q.resetsAt)}` : undefined} />
            <Stat
              label="Search credits"
              value={q?.credits ?? 0}
              icon={<CreditCard />}
              hint={
                <Link href={routes.brand.billing} className="font-medium text-brand-700 hover:underline">
                  Buy more →
                </Link>
              }
            />
            <Stat label="Saved creators" value={saved.data?.length ?? 0} icon={<Bookmark />} />
            <Stat label="Collab requests" value={collabs.data?.meta.total ?? 0} icon={<Handshake />} />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            title="Recent collaborations"
            action={
              <Link href={routes.collabs.root} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {collabs.isPending ? (
            <Skeleton className="m-6 h-32" />
          ) : !collabs.data?.items.length ? (
            <CardBody>
              <EmptyState icon={<Handshake />} title="No requests yet" description="Find a creator you like and send your first brief." />
            </CardBody>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {collabs.data.items.map((c) => (
                <li key={c.id}>
                  <Link href={routes.collabs.detail(c.id)} className="flex items-center gap-4 px-6 py-4 transition hover:bg-zinc-50">
                    <Avatar src={c.creatorProfile.avatarUrl} name={c.creatorProfile.displayName} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900">{c.title}</p>
                      <p className="text-xs text-zinc-500">
                        {c.creatorProfile.displayName} · {formatMoney(c.budgetCents, c.currency)} · {timeAgo(c.updatedAt)}
                      </p>
                    </div>
                    <CollabStatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Your shortlist"
            action={
              <Link href={routes.brand.saved} className="text-sm font-medium text-brand-700 hover:underline">
                Open
              </Link>
            }
          />
          <CardBody className="p-3">
            {saved.isPending ? (
              <Skeleton className="h-32" />
            ) : !saved.data?.length ? (
              <p className="p-3 text-sm text-zinc-500">Tap the bookmark on any creator to save them here.</p>
            ) : (
              <ul>
                {saved.data.slice(0, 5).map(({ creatorProfile: c }) => (
                  <li key={c.id}>
                    <Link href={routes.creatorPublic(c.username)} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-zinc-50">
                      <Avatar src={c.avatarUrl} name={c.displayName} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-zinc-900">{c.displayName}</span>
                        <span className="block text-xs text-zinc-500">@{c.username}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
