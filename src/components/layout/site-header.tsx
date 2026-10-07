'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { dashboardHome, routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { buttonClasses } from '@/components/ui/button';
import { Logo } from './logo';

const links = [
  { href: routes.discover, label: 'Find creators' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#for-creators', label: 'For creators' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const authButtons = isLoading ? (
    <div className="h-10 w-40 animate-pulse rounded-xl bg-zinc-100" />
  ) : user ? (
    <Link href={dashboardHome(user.role)} className={buttonClasses('dark')}>
      Go to dashboard <ArrowRight className="h-4 w-4" />
    </Link>
  ) : (
    <>
      <Link href={routes.login} className={buttonClasses('ghost')}>
        Log in
      </Link>
      <Link href={routes.register} className={buttonClasses('dark')}>
        Get started <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-200',
        scrolled || open ? 'border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === l.href ? 'text-zinc-950' : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">{authButtons}</div>
        <button
          className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-zinc-100 bg-white px-4 pt-3 pb-6 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-zinc-800 hover:bg-zinc-50">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 [&>a]:w-full" onClick={() => setOpen(false)}>
            {authButtons}
          </div>
        </div>
      )}
    </header>
  );
}
