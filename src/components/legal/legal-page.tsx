import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Container } from '@/components/ui/section';
import { cn } from '@/lib/utils';

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

const legalNav = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/data-deletion', label: 'Data Deletion' },
];

/** Shared shell for legal documents: hero, sticky table of contents, readable prose. */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
  current,
}: {
  title: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <div className="pb-24">
      <section className="relative -mt-16 overflow-hidden border-b border-zinc-200/70 pt-16">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <Container className="py-14">
          <nav className="flex flex-wrap gap-2" aria-label="Legal documents">
            {legalNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={current === l.href ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold ring-1 transition',
                  current === l.href ? 'bg-zinc-950 text-white ring-zinc-950' : 'bg-white text-zinc-600 ring-zinc-200 hover:text-zinc-950',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">{title}</h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-500">
            <FileText className="h-4 w-4" aria-hidden /> Effective {updated}
          </p>
          <div className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-600">{intro}</div>
        </Container>
      </section>

      <Container className="grid gap-12 pt-12 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-sm" aria-label="On this page">
            <p className="mb-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">On this page</p>
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-2 py-1.5 text-zinc-600 transition hover:bg-white hover:text-zinc-950">
                <span className="mr-2 text-zinc-400 tabular-nums">{i + 1}.</span>
                {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="legal-prose min-w-0 max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-b border-zinc-200/70 py-8 first:pt-0 last:border-0">
              <h2>
                <span className="mr-2 text-zinc-400 tabular-nums">{i + 1}.</span>
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </article>
      </Container>
    </div>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
