import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { routes } from '@/constants/routes';
import { Logo } from './logo';

const columns = [
  {
    title: 'For brands',
    links: [
      { label: 'Find creators', href: routes.discover },
      { label: 'Create brand account', href: `${routes.register}?role=brand` },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'How it works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'For creators',
    links: [
      { label: 'Join as a creator', href: `${routes.register}?role=creator` },
      { label: 'Your media kit', href: '/#for-creators' },
      { label: 'Log in', href: routes.login },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Fashion creators', href: `${routes.discover}?categories=fashion` },
      { label: 'Food creators', href: `${routes.discover}?categories=food` },
      { label: 'Tech creators', href: `${routes.discover}?categories=tech` },
      { label: 'Beauty creators', href: `${routes.discover}?categories=beauty` },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-zinc-400">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo inverted />
            <p className="mt-4 text-sm leading-relaxed">{siteConfig.description}</p>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Not affiliated with, endorsed or sponsored by Meta, Instagram, TikTok, Google or YouTube.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Legal">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/data-deletion" className="hover:text-white">
              Data Deletion
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
