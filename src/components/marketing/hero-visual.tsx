import { BadgeCheck, Bell, TrendingUp } from 'lucide-react';
import { formatCompact, formatMoney, formatPercent } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { PlatformBadge } from '@/components/creators/platform-badge';
import { coverFor } from '@/lib/visual';

/** Illustrative product mock-up (sample data, decorative only). */
export function HeroVisual() {
  const c = {
    username: 'yourname',
    displayName: 'Your Name',
    avatarUrl: null,
    totalFollowers: 248_000,
    avgEngagementRate: 6.4,
    minPriceCents: 12_000,
    city: 'Lahore',
    socialAccounts: [
      { platform: 'instagram' as const, followers: 142_000 },
      { platform: 'tiktok' as const, followers: 88_000 },
      { platform: 'youtube' as const, followers: 18_000 },
    ],
  };
  const bars = [38, 52, 46, 61, 58, 72, 69, 84, 80, 95];

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-brand-400/30 via-accent-400/25 to-warm-400/20 blur-3xl" />

      {/* Media kit card */}
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-zinc-200/80">
        <div className={`h-24 bg-gradient-to-br ${coverFor(c.username)}`}>
          <div className="bg-dots h-full w-full opacity-30 mix-blend-overlay" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-9 flex items-end justify-between">
            <Avatar src={c.avatarUrl} name={c.displayName} size={72} ring />
            <span className="mb-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">● Open for collabs</span>
          </div>
          <p className="mt-3 flex items-center gap-1 text-lg font-semibold tracking-tight text-zinc-950">
            {c.displayName} <BadgeCheck className="h-5 w-5 text-brand-500" />
          </p>
          <p className="text-sm text-zinc-500">
            @{c.username}
            {c.city ? ` · ${c.city}` : ''}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['Reach', formatCompact(c.totalFollowers)],
              ['Engagement', formatPercent(c.avgEngagementRate)],
              ['From', formatMoney(c.minPriceCents)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-100">
                <p className="text-[11px] text-zinc-500">{k}</p>
                <p className="text-base font-semibold tracking-tight text-zinc-950 tabular-nums">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl ring-1 ring-zinc-100">
            <div className="flex items-center justify-between px-4 pt-3">
              <p className="text-xs font-medium text-zinc-500">Follower growth</p>
              <p className="text-xs font-semibold text-emerald-600">+18.2%</p>
            </div>
            <div className="flex h-20 items-end gap-1.5 px-4 pt-2 pb-3">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-accent-400" style={{ height: `${h}%`, opacity: 0.35 + i * 0.065 }} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {c.socialAccounts.map((a) => (
              <span key={a.platform} className="inline-flex items-center gap-1.5 rounded-full py-0.5 pr-3 pl-0.5 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
                <PlatformBadge platform={a.platform} size={22} className="!rounded-full" />
                {formatCompact(a.followers)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: collab request notification */}
      <div className="animate-float absolute -top-6 -left-4 hidden w-64 rounded-2xl bg-white/95 p-3.5 shadow-lift ring-1 ring-zinc-200/80 backdrop-blur sm:block lg:-left-16">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Bell className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">New collab request</p>
            <p className="text-xs text-zinc-500">2 Reels + 3 Stories · $450 budget</p>
          </div>
        </div>
      </div>

      {/* Floating: engagement */}
      <div className="animate-float-delayed absolute -right-4 -bottom-6 hidden rounded-2xl bg-ink p-4 text-white shadow-lift sm:block lg:-right-10">
        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Avg. engagement
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{formatPercent(c.avgEngagementRate)}</p>
        <p className="text-[11px] text-zinc-400">Verified via official API</p>
      </div>
    </div>
  );
}
