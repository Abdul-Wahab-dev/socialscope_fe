'use client';

import Link from 'next/link';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { Bookmark, Trash2 } from 'lucide-react';
import { countryName } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { formatCompact, formatMoney, formatPercent } from '@/lib/utils';
import { getSavedCreators, unsaveCreator } from '@/services/brand.service';
import { Avatar, Badge, Button, Card, EmptyState, ErrorState, PageHeader, Skeleton, buttonClasses } from '@/components/ui';

export function SavedCreatorsView() {
  const queryCache = useQueryCache();
  const saved = useApiQuery({ queryKey: queryKeys.brand.saved, queryFn: getSavedCreators });
  const remove = useApiMutation({
    mutationFn: unsaveCreator,
    onSuccess: () => {
      toast.success('Removed from saved');
      queryCache.invalidate(queryKeys.brand.saved);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader title="Saved creators" description="Your shortlist. Compare stats side by side before reaching out." />
      {saved.isPending ? (
        <Skeleton className="h-64" />
      ) : saved.isError ? (
        <ErrorState message={saved.error.message} onRetry={() => saved.refetch()} />
      ) : saved.data.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-8 w-8" />}
          title="No saved creators"
          description="Tap the bookmark on any creator to shortlist them."
          action={
            <Link href={routes.discover} className={buttonClasses('primary')}>
              Find creators
            </Link>
          }
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-zinc-200 text-left text-xs text-zinc-500 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Creator</th>
                <th className="px-3 py-3 font-medium">Followers</th>
                <th className="px-3 py-3 font-medium">Engagement</th>
                <th className="px-3 py-3 font-medium">From</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {saved.data.map(({ creatorProfile: c, note }) => (
                <tr key={c.id}>
                  <td className="px-5 py-3">
                    <Link href={routes.creatorPublic(c.username)} className="flex items-center gap-3 hover:text-brand-700">
                      <Avatar src={c.avatarUrl} name={c.displayName} size={36} />
                      <div>
                        <p className="font-medium">{c.displayName}</p>
                        <p className="text-xs text-zinc-500">{[c.city, countryName(c.country)].filter(Boolean).join(', ') || `@${c.username}`}</p>
                        {note && <p className="text-xs text-zinc-400 italic">{note}</p>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{formatCompact(c.totalFollowers)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatPercent(c.avgEngagementRate)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatMoney(c.minPriceCents)}</td>
                  <td className="px-3 py-3">
                    {!c.isListed ? <Badge>Unlisted</Badge> : <Badge tone={c.isAvailable ? 'success' : 'neutral'}>{c.isAvailable ? 'Available' : 'Booked'}</Badge>}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => remove.mutate(c.id)} disabled={remove.isPending && remove.variables === c.id} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
