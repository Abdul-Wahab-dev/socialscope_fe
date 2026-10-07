'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Circle, Copy, Eye, Heart, Images, Link2, Rocket, Search, Tags, Users } from 'lucide-react';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { routes } from '@/constants/routes';
import { useCheckout } from '@/hooks/use-checkout';
import { useCreatorInsights, useMyCreatorProfile } from '@/hooks/use-creator';
import { usePublicConfig } from '@/hooks/use-meta';
import { formatCompact, formatMoney, formatPercent } from '@/lib/utils';
import type { SocialPlatform } from '@/types/creator';
import { Button, Card, CardBody, CardHeader, ErrorState, Skeleton } from '@/components/ui';
import { Stat } from '@/components/creators/stat';
import { LineChart, type Series } from '@/components/charts/line-chart';

const colors: Record<SocialPlatform, string> = { instagram: '#db2777', tiktok: '#18181b', youtube: '#dc2626' };

export function CreatorOverview() {
  const profile = useMyCreatorProfile();
  const insights = useCreatorInsights();
  const config = usePublicConfig();
  const checkout = useCheckout();

  if (profile.isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="h-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  if (profile.isError) return <ErrorState message={profile.error.message} onRetry={() => profile.refetch()} />;

  const p = profile.data;
  const publicUrl = `${env.siteUrl}${routes.creatorPublic(p.username)}`;
  const founding = (config.data?.foundingSlotsRemaining ?? 0) > 0;
  const done = p.listingChecklist.items.filter((i) => i.done).length;
  const progress = Math.round((done / p.listingChecklist.items.length) * 100);

  const series: Series[] = (['instagram', 'tiktok', 'youtube'] as SocialPlatform[])
    .map((platform) => ({
      name: platform[0]!.toUpperCase() + platform.slice(1),
      color: colors[platform],
      points: (insights.data?.history ?? []).filter((h) => h.platform === platform).map((h) => ({ x: new Date(h.capturedAt), y: h.followers })),
    }))
    .filter((s) => s.points.length > 0);

  const copy = () => navigator.clipboard.writeText(publicUrl).then(() => toast.success('Link copied'), () => toast.error('Could not copy'));

  return (
    <div className="space-y-8">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent-500/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-brand-600/50 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Creator studio</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Hi, {p.displayName} 👋</h1>
            {p.isListed ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live{p.isFounding ? ' · Founding creator' : ''}
                </span>
                <span className="max-w-full truncate text-zinc-300">{publicUrl}</span>
                <button onClick={copy} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 font-medium ring-1 ring-white/15 transition hover:bg-white/20">
                  <Copy className="h-3.5 w-3.5" /> Copy link
                </button>
              </div>
            ) : (
              <p className="mt-3 max-w-lg text-zinc-300">
                Your profile is {progress}% ready. Finish the checklist and go live so brands can find you
                {founding ? '. Early creators are listed free.' : '.'}
              </p>
            )}
          </div>
          {!p.isListed && (
            <Button variant="gradient" size="lg" onClick={() => checkout.mutate({ purpose: 'creator_registration' })} loading={checkout.isPending} disabled={!p.listingChecklist.ready}>
              <Rocket className="h-4 w-4" />
              {founding ? 'Go live for free' : `Pay ${formatMoney(config.data?.creatorRegistrationFeeCents ?? 0, config.data?.currency)} & go live`}
            </Button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total followers" value={formatCompact(p.totalFollowers)} icon={<Users />} />
        <Stat label="Avg engagement" value={formatPercent(p.avgEngagementRate)} icon={<Heart />} />
        <Stat label="Profile views" value={formatCompact(insights.data?.profileViews ?? p.profileViews)} icon={<Eye />} />
        <Stat label="Search appearances" value={formatCompact(insights.data?.searchAppearances ?? p.searchAppearances)} icon={<Search />} hint="Times brands saw you in results" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader title="Follower growth" description="Last 90 days, captured every time your stats sync." />
          <CardBody>{insights.isPending ? <Skeleton className="h-52" /> : <LineChart series={series} />}</CardBody>
        </Card>

        <div className="space-y-6">
          {!p.isListed && (
            <Card>
              <CardHeader title="Launch checklist" description={`${done} of ${p.listingChecklist.items.length} done`} />
              <CardBody className="space-y-4">
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="bg-brand-gradient h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <ul className="space-y-2.5">
                  {p.listingChecklist.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-2.5 text-sm">
                      {item.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-zinc-300" />}
                      <span className={item.done ? 'text-zinc-400 line-through' : 'font-medium text-zinc-800'}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Boost your profile" />
            <CardBody className="space-y-2 p-3">
              {[
                { href: routes.creator.socials, icon: Link2, title: 'Connect more platforms', sub: `${p.socialAccounts.length}/3 connected` },
                { href: routes.creator.rates, icon: Tags, title: 'Update your rate card', sub: `${p.rateCards.length} rate${p.rateCards.length === 1 ? '' : 's'} published` },
                { href: routes.creator.portfolio, icon: Images, title: 'Add past collaborations', sub: `${p.portfolioItems.length} item${p.portfolioItems.length === 1 ? '' : 's'}` },
              ].map(({ href, icon: Icon, title, sub }) => (
                <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-zinc-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-zinc-900">{title}</span>
                    <span className="block text-xs text-zinc-500">{sub}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-700" />
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
