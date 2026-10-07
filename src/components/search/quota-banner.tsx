import Link from 'next/link';
import { Gauge, Sparkles } from 'lucide-react';
import type { SearchQuota } from '@/types/search';
import { routes } from '@/constants/routes';
import { formatDate } from '@/lib/utils';

export function QuotaBanner({ quota, canBuy }: { quota?: SearchQuota; canBuy?: boolean }) {
  if (!quota) return null;
  if (quota.type === 'guest') {
    const pct = quota.limit ? (quota.remaining / quota.limit) * 100 : 0;
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-brand-50 via-white to-accent-400/10 p-4 ring-1 ring-brand-100 sm:flex-row sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-950">
            {quota.remaining} of {quota.limit} free guest searches left
          </p>
          <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-brand-100">
            <div className="bg-brand-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Link href={routes.register} className="text-sm font-semibold text-brand-700 hover:underline">
          Sign up free for 15 searches / week →
        </Link>
      </div>
    );
  }
  const pct = quota.weeklyLimit ? (quota.weeklyRemaining / quota.weeklyLimit) * 100 : 0;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-zinc-200/70 sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
        <Gauge className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-700">
          <span className="font-semibold text-zinc-950">{quota.weeklyRemaining}</span>/{quota.weeklyLimit} free searches this week · resets {formatDate(quota.resetsAt)} ·{' '}
          <span className="font-semibold text-zinc-950">{quota.credits}</span> credits
        </p>
        <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {canBuy && (
        <Link href={routes.brand.billing} className="text-sm font-semibold text-brand-700 hover:underline">
          Buy searches →
        </Link>
      )}
    </div>
  );
}
