'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApiQuery } from '@/lib/query';
import { Handshake } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn, formatMoney, timeAgo } from '@/lib/utils';
import { getCollabs } from '@/services/collab.service';
import type { CollabStatus } from '@/types/collab';
import { Avatar, Button, Card, EmptyState, ErrorState, PageHeader, Skeleton, buttonClasses } from '@/components/ui';
import { CollabStatusBadge } from './collab-status-badge';

const TABS: { label: string; value?: CollabStatus }[] = [
  { label: 'All' },
  { label: 'Pending', value: 'pending' },
  { label: 'Counter-offers', value: 'countered' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
];

export function CollabsListView() {
  const { user } = useAuth();
  const isBrand = user?.role === 'brand';
  const [status, setStatus] = useState<CollabStatus | undefined>();
  const [page, setPage] = useState(1);
  const params = { status, page, limit: 20 };
  const collabs = useApiQuery({ queryKey: queryKeys.collabs.list(params), queryFn: () => getCollabs(params), keepPreviousData: true });

  return (
    <>
      <PageHeader
        title={isBrand ? 'Collaborations' : 'Collab requests'}
        description={isBrand ? 'Requests you’ve sent to creators.' : 'Brands that want to work with you.'}
        action={
          isBrand ? (
            <Link href={routes.discover} className={buttonClasses('primary')}>
              Find creators
            </Link>
          ) : undefined
        }
      />
      <div className="mb-4 flex gap-1 overflow-x-auto" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={status === t.value}
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap',
              status === t.value ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {collabs.isPending ? (
        <Skeleton className="h-64" />
      ) : collabs.isError ? (
        <ErrorState message={collabs.error.message} onRetry={() => collabs.refetch()} />
      ) : collabs.data.items.length === 0 ? (
        <EmptyState
          icon={<Handshake className="h-8 w-8" />}
          title="Nothing here yet"
          description={isBrand ? 'Send a collab request from any creator’s profile.' : 'Complete your profile and rate card to get more requests.'}
        />
      ) : (
        <Card>
          <ul className="divide-y divide-zinc-100">
            {collabs.data.items.map((c) => {
              const counterpart = isBrand
                ? { name: c.creatorProfile.displayName, avatar: c.creatorProfile.avatarUrl }
                : { name: c.brandUser.brandProfile?.companyName ?? c.brandUser.fullName, avatar: c.brandUser.brandProfile?.logoUrl };
              return (
                <li key={c.id}>
                  <Link href={routes.collabs.detail(c.id)} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50">
                    <Avatar src={counterpart.avatar} name={counterpart.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.title}</p>
                      <p className="truncate text-sm text-zinc-500">
                        {counterpart.name} · {formatMoney(c.budgetCents, c.currency)} · updated {timeAgo(c.updatedAt)}
                      </p>
                    </div>
                    {!!c.unreadCount && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{c.unreadCount} new</span>}
                    <CollabStatusBadge status={c.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {collabs.data && collabs.data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-zinc-600">
            Page {page} of {collabs.data.meta.totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= collabs.data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </>
  );
}
