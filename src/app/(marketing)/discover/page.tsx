import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BadgeCheck } from 'lucide-react';
import { DiscoverView } from '@/components/search/discover-view';
import { Container, Spinner } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Find creators',
  description: 'Search verified content creators by niche, location, platform, audience size and price.',
};

export default function DiscoverPage() {
  return (
    <div className="pb-24">
      <section className="relative -mt-16 overflow-hidden border-b border-zinc-200/70 pt-16">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-80 w-[40rem] rounded-full bg-gradient-to-r from-brand-300/40 via-accent-400/20 to-transparent blur-3xl" aria-hidden />
        <Container className="py-12 sm:py-14">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
            <BadgeCheck className="h-4 w-4" /> Every stat comes from a connected account
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">Find your next creator</h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-600">Filter by niche, platform, audience size, location and budget, then shortlist and send a brief.</p>
        </Container>
      </section>
      <Container className="pt-8">
        <Suspense fallback={<Spinner />}>
          <DiscoverView />
        </Suspense>
      </Container>
    </div>
  );
}
