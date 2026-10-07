'use client';

import Link from 'next/link';
import { BadgeCheck, Bookmark, BookmarkCheck, MapPin, Sparkles } from 'lucide-react';
import type { CreatorCardData } from '@/types/creator';
import { routes } from '@/constants/routes';
import { countryName } from '@/constants/options';
import { useCategoryName } from '@/hooks/use-meta';
import { cn, formatCompact, formatMoney, formatPercent } from '@/lib/utils';
import { coverFor } from '@/lib/visual';
import { Avatar } from '@/components/ui';
import { PlatformBadge } from './platform-badge';


interface CreatorCardProps {
  creator: CreatorCardData;
  onToggleSave?: (creator: CreatorCardData) => void;
  savePending?: boolean;
  className?: string;
}

export function CreatorCard({ creator, onToggleSave, savePending, className }: CreatorCardProps) {
  const categoryName = useCategoryName();
  const location = [creator.city, countryName(creator.country)].filter(Boolean).join(', ');

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-zinc-200/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className={cn('relative h-20 bg-gradient-to-br', coverFor(creator.username))}>
        <div className="bg-dots absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {creator.isFounding && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-brand-700 backdrop-blur">
              <Sparkles className="h-3 w-3" aria-hidden /> Founding
            </span>
          )}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur',
              creator.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-zinc-900/70 text-white',
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
            {creator.isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(creator)}
            disabled={savePending}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-soft backdrop-blur transition hover:scale-105 hover:text-brand-700 disabled:opacity-50"
            aria-label={creator.isSaved ? 'Remove from saved' : 'Save creator'}
            aria-pressed={creator.isSaved}
          >
            {creator.isSaved ? <BookmarkCheck className="h-4 w-4 text-brand-600" /> : <Bookmark className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="relative z-10 -mt-8 flex items-end justify-between gap-3">
          <Avatar src={creator.avatarUrl} name={creator.displayName} size={64} ring />
        </div>

        <div className="mt-3">
          <Link
            href={routes.creatorPublic(creator.username)}
            className="flex items-center gap-1 font-semibold tracking-tight text-zinc-950 after:absolute after:inset-0 group-hover:text-brand-700"
          >
            <span className="truncate">{creator.displayName}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" aria-label="Verified stats" />
          </Link>
          <p className="truncate text-sm text-zinc-500">@{creator.username}</p>
        </div>

        {location && (
          <p className="mt-2 flex items-center gap-1 text-[13px] text-zinc-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> <span className="truncate">{location}</span>
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {creator.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
              {categoryName(c)}
            </span>
          ))}
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
          <div>
            <dt className="text-[11px] font-medium text-zinc-500">Reach</dt>
            <dd className="text-lg font-semibold tracking-tight text-zinc-950 tabular-nums">{formatCompact(creator.totalFollowers)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium text-zinc-500">Engagement</dt>
            <dd className="text-lg font-semibold tracking-tight text-zinc-950 tabular-nums">{formatPercent(creator.avgEngagementRate)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium text-zinc-500">From</dt>
            <dd className="text-lg font-semibold tracking-tight text-zinc-950 tabular-nums">{formatMoney(creator.minPriceCents)}</dd>
          </div>
        </dl>

        {creator.socialAccounts.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {creator.socialAccounts.map((a) => (
              <span key={a.platform} className="inline-flex items-center gap-1.5 rounded-full bg-white py-0.5 pr-2.5 pl-0.5 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
                <PlatformBadge platform={a.platform} size={20} className="!rounded-full" />
                {formatCompact(a.followers)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
