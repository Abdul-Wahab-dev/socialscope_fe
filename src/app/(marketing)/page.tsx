import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  Filter,
  Handshake,
  LineChart,
  Link2,
  MessagesSquare,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  UserRoundPlus,
  Wallet,
} from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { formatCompact, formatMoney } from "@/lib/utils";
import { routes } from "@/constants/routes";
import { categoryIcon } from "@/constants/category-icons";
import type { Category, CreatorCardData } from "@/types/creator";
import type { PublicConfig, PublicStats } from "@/types/payment";
import { buttonClasses } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/section";
import { Tabs } from "@/components/ui/tabs";
import { CreatorCard } from "@/components/creators/creator-card";
import { PlatformBadge } from "@/components/creators/platform-badge";
import { HeroSearch } from "@/components/marketing/hero-search";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Faq } from "@/components/marketing/faq";

export const revalidate = 300;

/** Landing data is optional: every call degrades gracefully if the API is down. */
async function getHomeData() {
  const opts = { next: { revalidate: 300 } };
  const [featured, stats, config, categories] = await Promise.all([
    serverFetch<CreatorCardData[]>("/creators/featured?limit=8", opts).catch(
      () => [],
    ),
    serverFetch<PublicStats>("/meta/stats", opts).catch(() => null),
    serverFetch<PublicConfig>("/meta/config", opts).catch(() => null),
    serverFetch<Category[]>("/meta/categories", {
      next: { revalidate: 3600 },
    }).catch(() => []),
  ]);
  return { featured, stats, config, categories };
}

const faqs = (c: PublicConfig | null) => [
  {
    q: "Where do the creator stats come from?",
    a: "Creators connect their Instagram, TikTok and YouTube accounts through each platform’s official login. We read followers, views, likes and comments directly from the platform and refresh them automatically every 12 hours. Nothing is self-reported.",
  },
  {
    q: "Is it free for brands?",
    a: `You can run ${c?.guestSearchLimit ?? 3} searches without an account. A free account gives you ${c?.weeklyFreeSearchLimit ?? 15} searches every week. If you need more, buy a search pack; credits never expire. Browsing results, saving creators and sending collab requests are always free.`,
  },
  {
    q: "Why do creators pay to be listed?",
    a: `A small one-time fee (${formatMoney(c?.creatorRegistrationFeeCents ?? 300, c?.currency)}) keeps the marketplace full of creators who actually want paid collaborations, so brands don’t waste time on inactive profiles. ${
      (c?.foundingSlotsRemaining ?? 0) > 0
        ? "Right now, early creators are listed free with a Founding badge."
        : ""
    }`,
  },
  {
    q: "How do collaborations work?",
    a: "Brands send a structured brief with deliverables, budget and deadline. The creator can accept, decline or send a counter-offer, and both sides chat in a dedicated thread, so every deal has a clear record.",
  },
  {
    q: "Which platforms are supported?",
    a: "Instagram (Creator or Business accounts), TikTok and YouTube. More platforms are on the roadmap.",
  },
  {
    q: "Can a creator list someone else’s account?",
    a: "No. Accounts can only be added by logging into them, and each social account can belong to one creator only.",
  },
];

export default async function HomePage() {
  const { featured, stats, config, categories } = await getHomeData();
  const topCategories = [...categories].sort(
    (a, b) =>
      (stats?.categoryCounts[b.slug] ?? 0) -
      (stats?.categoryCounts[a.slug] ?? 0),
  );
  const founding = (config?.foundingSlotsRemaining ?? 0) > 0;

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div
          className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-[-10rem] left-1/2 -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-300/40 via-accent-400/25 to-warm-400/25 blur-3xl"
          aria-hidden
        />
        <Container className="grid items-center gap-16 pt-16 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-24 lg:pb-28">
          <div className="animate-fade-up">
            <Eyebrow>
              <span className="flex -space-x-1">
                <PlatformBadge
                  platform="instagram"
                  size={16}
                  className="!rounded-full ring-2 ring-white"
                />
                <PlatformBadge
                  platform="tiktok"
                  size={16}
                  className="!rounded-full ring-2 ring-white"
                />
                <PlatformBadge
                  platform="youtube"
                  size={16}
                  className="!rounded-full ring-2 ring-white"
                />
              </span>
              Verified stats from official platform APIs
            </Eyebrow>
            <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-[4.2rem]">
              Find creators who{" "}
              <span className="text-gradient">actually move</span> your brand.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Search creators by niche, city and real audience numbers, compare
              their rates, and send a paid collab request in minutes. No DMs, no
              screenshots, no guesswork.
            </p>
            <div className="mt-8 max-w-xl">
              <HeroSearch categories={categories} />
              {topCategories.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                  <span>Popular:</span>
                  {topCategories.slice(0, 4).map((c) => (
                    <Link
                      key={c.slug}
                      href={`${routes.discover}?categories=${c.slug}&sort=relevance`}
                      className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-zinc-700 ring-1 ring-zinc-200 transition hover:text-brand-700 hover:ring-brand-300"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-zinc-600">
              {[
                "No credit card needed",
                `${config?.guestSearchLimit ?? 3} free searches, no account`,
                "Real, synced stats",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <HeroVisual />
        </Container>
      </section>

      {/* ───────────────────────── Category marquee ───────────────────────── */}
      {categories.length > 0 && (
        <section
          className="border-y border-zinc-200/70 bg-white py-6"
          aria-label="Creator categories"
        >
          <div className="mask-fade-x overflow-hidden">
            <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
              {[...categories, ...categories].map((c, i) => {
                const Icon = categoryIcon(c.slug);
                return (
                  <Link
                    key={`${c.slug}-${i}`}
                    href={`${routes.discover}?categories=${c.slug}&sort=relevance`}
                    aria-hidden={i >= categories.length || undefined}
                    tabIndex={i >= categories.length ? -1 : undefined}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium whitespace-nowrap text-zinc-700 ring-1 ring-zinc-200/80 transition hover:bg-white hover:text-brand-700"
                  >
                    <Icon className="h-4 w-4 text-brand-500" aria-hidden />
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────────────── Live numbers ───────────────────────── */}
      {stats && (
        <section className="py-16">
          <Container>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-zinc-200/70 ring-1 ring-zinc-200/70 lg:grid-cols-4">
              {[
                {
                  label: "Verified creators",
                  value: formatCompact(stats.listedCreators),
                  icon: BadgeCheck,
                },
                {
                  label: "Combined audience",
                  value: formatCompact(stats.totalReach),
                  icon: BarChart3,
                },
                { label: "Countries", value: stats.countries, icon: Sparkles },
                { label: "Platforms connected", value: 3, icon: Link2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white p-6 sm:p-8">
                  <Icon className="h-5 w-5 text-brand-500" aria-hidden />
                  <dd className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 tabular-nums sm:text-4xl">
                    {value}
                  </dd>
                  <dt className="mt-1 text-sm text-zinc-500">{label}</dt>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From brief to booked in three steps"
            description="Built for both sides of the deal, so brands find the right people fast and creators get serious, paid offers."
          />
          <Tabs
            className="mt-12 flex flex-col items-center"
            items={[
              {
                id: "brands",
                label: "For brands",
                content: (
                  <StepGrid
                    steps={[
                      {
                        icon: Search,
                        title: "Search & filter",
                        body: "Filter by niche, city, platform, audience size, engagement rate and price to build a shortlist in minutes.",
                      },
                      {
                        icon: BarChart3,
                        title: "Compare real stats",
                        body: "Every number is pulled from the creator’s connected account and refreshed automatically, including follower history.",
                      },
                      {
                        icon: Handshake,
                        title: "Send a paid brief",
                        body: "Share deliverables, budget and deadline. Accept counter-offers and chat in one thread until the content is live.",
                      },
                    ]}
                  />
                ),
              },
              {
                id: "creators",
                label: "For creators",
                content: (
                  <StepGrid
                    steps={[
                      {
                        icon: UserRoundPlus,
                        title: "Create your profile",
                        body: "Add your niche, location, languages and a short bio. Takes about two minutes.",
                      },
                      {
                        icon: Link2,
                        title: "Connect your accounts",
                        body: "Log in with Instagram, TikTok or YouTube. Your stats import instantly and stay up to date.",
                      },
                      {
                        icon: Wallet,
                        title: "Get paid offers",
                        body: "Publish your rate card and receive structured collab requests. Accept, decline or counter-offer.",
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        </Container>
      </section>

      {/* ───────────────────────── Feature bento ───────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Why brands choose us"
            title="Everything you need to run creator campaigns"
            description="Skip the spreadsheets and cold DMs. Discovery, vetting and deal-making all live in one place."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-6">
            <BentoTile
              className="md:col-span-4"
              icon={Filter}
              title="Filters that match how you brief"
              body="Niche, platform, audience tier, city, language, engagement and budget. Stack them to find exactly who you need."
            >
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Food & Cooking",
                  "Lahore",
                  "Instagram",
                  "Micro · 10K–100K",
                  "Engagement ≥ 4%",
                  "Under $200",
                  "Urdu",
                ].map((chip, i) => (
                  <span
                    key={chip}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${i < 3 ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200"}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </BentoTile>
            <BentoTile
              className="md:col-span-2"
              icon={ShieldCheck}
              title="Verified, not self-reported"
              body="Stats come from official APIs. Each social account can belong to one creator only."
            />
            <BentoTile
              className="md:col-span-2"
              icon={Tags}
              title="Transparent rate cards"
              body="See prices per Reel, video or story before you reach out."
            />
            <BentoTile
              className="md:col-span-2"
              icon={MessagesSquare}
              title="Built-in deal inbox"
              body="Briefs, counter-offers and messages stay in one thread per deal."
            />
            <BentoTile
              className="md:col-span-2"
              icon={LineChart}
              title="Growth history"
              body="Follower and engagement trends, so you can spot bought audiences."
            />
            <BentoTile
              dark
              className="md:col-span-6"
              icon={Rocket}
              title="Search smarter, not harder"
              body="Paging through results and re-sorting never costs a search. Save creators to shortlists and compare them side by side."
            >
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  [
                    "Free guest searches",
                    String(config?.guestSearchLimit ?? 3),
                  ],
                  [
                    "Free searches every week",
                    String(config?.weeklyFreeSearchLimit ?? 15),
                  ],
                  ["Cost to send a collab request", "$0"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                  >
                    <p className="text-3xl font-semibold tracking-tight">{v}</p>
                    <p className="mt-1 text-sm text-zinc-400">{k}</p>
                  </div>
                ))}
              </div>
            </BentoTile>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── Featured creators ───────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Featured creators"
                title="Creators open for collabs right now"
                description="A few of the top-performing creators on the platform this week."
              />
              <Link
                href={routes.discover}
                className={buttonClasses("secondary", "lg")}
              >
                Explore all creators <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────────── Categories grid ───────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Browse by niche"
              title="Every niche, every audience"
              description="Jump straight into a category and filter from there."
            />
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {topCategories.map((c) => {
                const Icon = categoryIcon(c.slug);
                const count = stats?.categoryCounts[c.slug] ?? 0;
                return (
                  <Link
                    key={c.slug}
                    href={`${routes.discover}?categories=${c.slug}&sort=relevance`}
                    className="group flex flex-col rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200/70 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lift"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft ring-1 ring-zinc-200 transition group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="mt-4 text-sm font-semibold text-zinc-900">
                      {c.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {count > 0
                        ? `${count} creator${count === 1 ? "" : "s"}`
                        : "Be the first"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────────── For creators ───────────────────────── */}
      <section id="for-creators" className="scroll-mt-20 py-20 sm:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-white sm:px-12 lg:px-16">
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl"
              aria-hidden
            />
            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15">
                  For creators
                </p>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Your always-up-to-date media kit, and a pipeline of paid
                  offers.
                </h2>
                <p className="mt-5 text-lg text-zinc-300">
                  Stop sending screenshots. Share one link with live stats, your
                  rates and past work, and let brands come to you.
                </p>
                <ul className="mt-8 space-y-3 text-[15px] text-zinc-200">
                  {[
                    "Public media kit link for your bio",
                    "Stats sync automatically from Instagram, TikTok & YouTube",
                    "Rate card and portfolio brands see before they reach out",
                    "Accept, decline or counter-offer every request",
                    "See how often you appear in brand searches",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-brand-200">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`${routes.register}?role=creator`}
                    className={buttonClasses("gradient", "lg")}
                  >
                    Create your media kit <ArrowRight className="h-4 w-4" />
                  </Link>
                  {founding && (
                    <span className="inline-flex items-center gap-2 text-sm text-zinc-300">
                      <Sparkles className="h-4 w-4 text-warm-400" /> Free for
                      early creators ({config?.foundingSlotsRemaining} spots
                      left)
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                  <p className="text-xs font-medium text-zinc-400">
                    Collab inbox
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        t: "Summer skincare launch",
                        m: "1 Reel + 3 Stories",
                        b: "$320",
                        s: "New",
                        cls: "bg-amber-400/15 text-amber-300",
                      },
                      {
                        t: "Ramadan food series",
                        m: "2 TikToks",
                        b: "$450",
                        s: "Counter-offer",
                        cls: "bg-sky-400/15 text-sky-300",
                      },
                      {
                        t: "Budget phone review",
                        m: "1 YouTube video",
                        b: "$600",
                        s: "Accepted",
                        cls: "bg-emerald-400/15 text-emerald-300",
                      },
                    ].map((r) => (
                      <div
                        key={r.t}
                        className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                          <Handshake className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {r.t}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {r.m} · {r.b}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.cls}`}
                        >
                          {r.s}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-[11px] text-zinc-500">
                    Example inbox
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── Pricing ───────────────────────── */}
      <section id="pricing" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, fair pricing for both sides"
            description="Brands pay only when they need more searches. Creators pay once to stay in a serious marketplace."
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
            <PriceCard
              label="For brands"
              price="Free"
              suffix="to start"
              description={`${config?.guestSearchLimit ?? 3} searches without an account, then ${config?.weeklyFreeSearchLimit ?? 15} free searches every week.`}
              features={[
                "Unlimited paging & re-sorting",
                "Save creators to shortlists",
                "Unlimited collab requests & messaging",
                "Buy search packs only when you need them",
              ]}
              cta={{
                href: `${routes.register}?role=brand`,
                label: "Create a brand account",
              }}
            >
              {config && (
                <div className="mt-6 divide-y divide-zinc-100 rounded-2xl bg-zinc-50 ring-1 ring-zinc-200/70">
                  {config.searchCreditPackages.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="text-zinc-700">
                        <span className="font-semibold text-zinc-900">
                          {p.name}
                        </span>{" "}
                        · {p.credits} searches
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatMoney(p.priceCents, config.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </PriceCard>
            <PriceCard
              highlighted
              ribbon={founding ? "Launch offer" : "One-time fee"}
              label="For creators"
              price={
                founding
                  ? "Free"
                  : formatMoney(
                      config?.creatorRegistrationFeeCents ?? 300,
                      config?.currency,
                    )
              }
              suffix={founding ? "for early creators" : "one-time"}
              description={
                founding
                  ? `Founding creators get listed free with a badge. After that it’s a one-time ${formatMoney(config?.creatorRegistrationFeeCents ?? 300, config?.currency)}.`
                  : "A one-time listing fee. No subscription, no commission on your deals."
              }
              features={[
                "Public media kit with live stats",
                "Instagram, TikTok & YouTube sync",
                "Rate card & portfolio",
                "Collab inbox with counter-offers",
                "Profile views & search insights",
              ]}
              cta={{
                href: `${routes.register}?role=creator`,
                label: "Join as a creator",
              }}
            />
          </div>
        </Container>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions, answered"
            description="Can’t find what you’re looking for? Create a free account and look around, no card required."
          />
          <Faq items={faqs(config)} />
        </Container>
      </section>

      {/* ───────────────────────── Final CTA ───────────────────────── */}
      <section className="pb-24">
        <Container>
          <div className="bg-brand-gradient relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center text-white shadow-glow sm:px-16 sm:py-20">
            <div
              className="bg-grid pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
              aria-hidden
            />
            <h2 className="relative mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Your next campaign starts with the right creator.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/85">
              Search for free, shortlist in minutes, and send your first brief
              today.
            </p>
            <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={routes.discover}
                className={buttonClasses("dark", "xl")}
              >
                <Search className="h-5 w-5" /> Find creators
              </Link>
              <Link
                href={`${routes.register}?role=creator`}
                className={buttonClasses("secondary", "xl", "ring-white/40")}
              >
                I’m a creator
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// ───────────────────────── Section helpers ─────────────────────────

type IconType = typeof Search;

function StepGrid({
  steps,
}: {
  steps: { icon: IconType; title: string; body: string }[];
}) {
  return (
    <ol className="mt-10 grid w-full gap-5 md:grid-cols-3">
      {steps.map(({ icon: Icon, title, body }, i) => (
        <li
          key={title}
          className="relative rounded-3xl bg-white p-7 shadow-soft ring-1 ring-zinc-200/70"
        >
          <span
            className="absolute top-6 right-6 font-mono text-5xl font-semibold text-zinc-100"
            aria-hidden
          >
            0{i + 1}
          </span>
          <span className="bg-brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-950">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{body}</p>
        </li>
      ))}
    </ol>
  );
}

function BentoTile({
  icon: Icon,
  title,
  body,
  className,
  dark,
  children,
}: {
  icon: IconType;
  title: string;
  body: string;
  className?: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-7 ${
        dark ? "bg-ink text-white" : "bg-zinc-50 ring-1 ring-zinc-200/70"
      } ${className ?? ""}`}
    >
      {dark && (
        <div
          className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-brand-600/40 blur-3xl"
          aria-hidden
        />
      )}
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${dark ? "bg-white/10 text-brand-200" : "bg-white text-brand-600 shadow-soft ring-1 ring-zinc-200"}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3
        className={`relative mt-5 text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-zinc-950"}`}
      >
        {title}
      </h3>
      <p
        className={`relative mt-2 max-w-xl text-sm leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-600"}`}
      >
        {body}
      </p>
      <div className="relative">{children}</div>
    </div>
  );
}

function PriceCard({
  label,
  price,
  suffix,
  description,
  features,
  cta,
  highlighted,
  ribbon,
  children,
}: {
  ribbon?: string;
  label: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  cta: { href: string; label: string };
  highlighted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 ${highlighted ? "bg-white shadow-lift ring-2 ring-brand-500" : "bg-zinc-50 ring-1 ring-zinc-200/70"}`}
    >
      {ribbon && (
        <span className="bg-brand-gradient absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-glow">
          {ribbon}
        </span>
      )}
      <p className="text-sm font-semibold text-brand-700">{label}</p>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight text-zinc-950">
          {price}
        </span>
        <span className="text-sm text-zinc-500">{suffix}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        {description}
      </p>
      <ul className="mt-6 space-y-3 text-sm text-zinc-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
              strokeWidth={2.5}
              aria-hidden
            />
            {f}
          </li>
        ))}
      </ul>
      {children}
      <Link
        href={cta.href}
        className={buttonClasses(
          highlighted ? "gradient" : "dark",
          "lg",
          "mt-8 w-full",
        )}
      >
        {cta.label}
      </Link>
    </div>
  );
}
