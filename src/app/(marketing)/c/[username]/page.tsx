import type { Metadata } from 'next';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BadgeCheck, Briefcase, ExternalLink, Eye, Heart, MapPin, ShieldCheck, Star, Tag, Users } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { AppError } from '@/lib/api-error';
import { countryName, DELIVERABLES } from '@/constants/options';
import { formatCompact, formatDate, formatMoney, formatPercent, timeAgo } from '@/lib/utils';
import { coverFor } from '@/lib/visual';
import type { Category, PublicCreatorProfile } from '@/types/creator';
import { Alert, Avatar, Badge, Card, CardBody, CardHeader, Container } from '@/components/ui';
import { PlatformBadge, platformLabel } from '@/components/creators/platform-badge';
import { CreatorActions } from '@/components/creators/creator-actions';
import { Stat } from '@/components/creators/stat';

type Params = { params: Promise<{ username: string }> };

/** Deduped per request so generateMetadata + page count as a single profile view. */
const getCreator = cache(async (username: string) => {
  const cookieHeader = (await cookies()).toString(); // lets the owner preview an unlisted profile
  try {
    return await serverFetch<PublicCreatorProfile>(`/creators/${encodeURIComponent(username)}`, { cache: 'no-store', headers: { Cookie: cookieHeader } });
  } catch (error) {
    if (error instanceof AppError && (error.status === 404 || error.status === 422)) return null;
    throw error;
  }
});

const getCategories = cache(() => serverFetch<Category[]>('/meta/categories', { next: { revalidate: 3600 } }).catch(() => [] as Category[]));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreator(username);
  if (!creator) return { title: 'Creator not found' };
  return {
    title: `${creator.displayName} (@${creator.username}) — media kit`,
    description: creator.bio ?? `${creator.displayName}: ${formatCompact(creator.totalFollowers)} followers, ${formatPercent(creator.avgEngagementRate)} engagement.`,
    openGraph: { images: creator.avatarUrl ? [creator.avatarUrl] : undefined },
  };
}

export default async function CreatorPublicPage({ params }: Params) {
  const { username } = await params;
  const [creator, categories] = await Promise.all([getCreator(username), getCategories()]);
  if (!creator) notFound();

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const deliverableLabel = (d: string) => DELIVERABLES.find((x) => x.value === d)?.label ?? d;
  const location = [creator.city, countryName(creator.country)].filter(Boolean).join(', ');
  const withViews = creator.socialAccounts.filter((a) => a.avgViews > 0);
  const totalViews = withViews.length ? Math.round(withViews.reduce((s, a) => s + a.avgViews, 0) / withViews.length) : 0;
  const lastSync = creator.socialAccounts.map((a) => a.lastSyncedAt).filter(Boolean).sort().pop() ?? null;

  return (
    <div className="pb-24">
      <Container className="pt-6">
        {creator.isOwnerPreview && !creator.isListed && (
          <Alert tone="warning" title="Preview: your profile is not live yet" className="mb-6">
            Only you can see this page. Activate your listing from the dashboard so brands can find you.
          </Alert>
        )}

        {/* Cover + identity */}
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-zinc-200/70">
          <div className={`relative h-40 bg-gradient-to-br sm:h-56 ${coverFor(creator.username)}`}>
            <div className="bg-dots absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
          </div>
          <div className="flex flex-col gap-6 px-6 pb-8 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative z-10 -mt-14 sm:-mt-16">
                <Avatar src={creator.avatarUrl} name={creator.displayName} size={128} ring className="shadow-lift" />
              </div>
              <div className="min-w-0 space-y-2 sm:pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{creator.displayName}</h1>
                  <BadgeCheck className="h-6 w-6 text-brand-500" aria-label="Verified stats" />
                </div>
                <p className="text-zinc-500">@{creator.username}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={creator.isAvailable ? 'success' : 'neutral'} dot>
                    {creator.isAvailable ? 'Open for collabs' : 'Currently booked'}
                  </Badge>
                  {creator.isFounding && (
                    <Badge tone="brand">
                      <Star className="h-3 w-3" /> Founding creator
                    </Badge>
                  )}
                  {location && (
                    <Badge>
                      <MapPin className="h-3 w-3" /> {location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <CreatorActions
              creator={{
                id: creator.id,
                displayName: creator.displayName,
                isAvailable: creator.isAvailable,
                isOwnerPreview: creator.isOwnerPreview,
                platforms: creator.socialAccounts.map((a) => a.platform),
              }}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Total followers" value={formatCompact(creator.totalFollowers)} icon={<Users />} />
              <Stat label="Avg engagement" value={formatPercent(creator.avgEngagementRate)} icon={<Heart />} />
              <Stat label="Avg views / post" value={totalViews ? formatCompact(totalViews) : '—'} icon={<Eye />} />
              <Stat label="Starting price" value={formatMoney(creator.minPriceCents)} icon={<Tag />} />
            </div>

            {creator.bio && (
              <Card>
                <CardHeader title="About" />
                <CardBody>
                  <p className="text-[15px] leading-relaxed whitespace-pre-line text-zinc-700">{creator.bio}</p>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardHeader
                title="Verified social accounts"
                description={`Pulled from each platform’s official API · updated ${timeAgo(lastSync)}`}
                icon={<ShieldCheck />}
              />
              <CardBody className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {creator.socialAccounts.length === 0 && <p className="text-sm text-zinc-500">No accounts connected yet.</p>}
                {creator.socialAccounts.map((a) => (
                  <div key={a.id} className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200/70">
                    <div className="flex items-center gap-3">
                      <PlatformBadge platform={a.platform} size={40} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-950">{platformLabel(a.platform)}</p>
                        {a.profileUrl ? (
                          <a href={a.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-xs text-brand-700 hover:underline">
                            @{a.handle} <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="truncate text-xs text-zinc-500">@{a.handle}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 tabular-nums">{formatCompact(a.followers)}</p>
                    <p className="text-xs text-zinc-500">followers</p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-200/70 pt-4 text-center">
                      {[
                        ['Eng.', formatPercent(a.engagementRate)],
                        ['Views', a.avgViews ? formatCompact(a.avgViews) : '—'],
                        ['Posts', formatCompact(a.postsCount)],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[11px] text-zinc-500">{k}</dt>
                          <dd className="text-sm font-semibold text-zinc-900 tabular-nums">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Rate card" description="Starting prices. Final price depends on the brief." icon={<Tag />} />
              <CardBody className="p-0">
                {creator.rateCards.length === 0 ? (
                  <p className="p-6 text-sm text-zinc-500">Rates available on request.</p>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {creator.rateCards.map((r) => (
                      <li key={r.id} className="flex items-start justify-between gap-4 px-6 py-4">
                        <div className="flex items-start gap-3">
                          {r.platform ? <PlatformBadge platform={r.platform} size={32} /> : <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500"><Tag className="h-4 w-4" /></span>}
                          <div>
                            <p className="text-sm font-semibold text-zinc-950">{r.title}</p>
                            <p className="text-xs text-zinc-500">
                              {deliverableLabel(r.deliverable)}
                              {r.platform ? ` · ${platformLabel(r.platform)}` : ''}
                            </p>
                            {r.description && <p className="mt-1 text-xs text-zinc-600">{r.description}</p>}
                          </div>
                        </div>
                        <p className="text-lg font-semibold whitespace-nowrap text-zinc-950 tabular-nums">{formatMoney(r.priceCents, r.currency)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Past collaborations" icon={<Briefcase />} />
              <CardBody>
                {creator.portfolioItems.length === 0 ? (
                  <p className="text-sm text-zinc-500">No portfolio items yet.</p>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {creator.portfolioItems.map((p) => (
                      <li key={p.id} className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70">
                        {p.brandName && <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">{p.brandName}</p>}
                        <p className="mt-1 text-sm font-semibold text-zinc-950">{p.title}</p>
                        {p.description && <p className="mt-1 text-xs leading-relaxed text-zinc-600">{p.description}</p>}
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">
                            View content <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-600/50 blur-3xl" aria-hidden />
              <p className="relative text-sm text-zinc-400">Work with {creator.displayName}</p>
              <p className="relative mt-1 text-3xl font-semibold tracking-tight">
                {creator.minPriceCents !== null ? (
                  <>
                    <span className="text-base font-normal text-zinc-400">from </span>
                    {formatMoney(creator.minPriceCents)}
                  </>
                ) : (
                  'Rates on request'
                )}
              </p>
              <p className="relative mt-3 text-sm text-zinc-400">Send a brief with deliverables, budget and deadline. The creator can accept or counter-offer.</p>
            </div>
            <Card>
              <CardBody className="space-y-5">
                <Fact label="Niches">
                  <div className="flex flex-wrap gap-1.5">
                    {creator.categories.map((c) => (
                      <Badge key={c}>{catName(c)}</Badge>
                    ))}
                  </div>
                </Fact>
                {creator.languages.length > 0 && (
                  <Fact label="Languages">
                    <p className="text-sm text-zinc-800 capitalize">{creator.languages.join(', ')}</p>
                  </Fact>
                )}
                {location && (
                  <Fact label="Based in">
                    <p className="text-sm text-zinc-800">{location}</p>
                  </Fact>
                )}
                <Fact label="Member since">
                  <p className="text-sm text-zinc-800">{formatDate(creator.createdAt, { month: 'long', year: 'numeric' })}</p>
                </Fact>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{label}</p>
      {children}
    </div>
  );
}
