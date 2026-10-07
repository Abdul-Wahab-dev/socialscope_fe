import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('bg-brand-gradient relative inline-flex items-center justify-center rounded-[10px] text-white shadow-glow', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" width={size * 0.56} height={size * 0.56} aria-hidden>
        <path d="M12 3l2.2 5.6L20 9.5l-4.5 3.8L17 19l-5-3.1L7 19l1.5-5.7L4 9.5l5.8-.9L12 3z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ href = '/', inverted = false }: { href?: string; inverted?: boolean }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2.5 text-[17px] font-semibold tracking-tight', inverted ? 'text-white' : 'text-zinc-950')}>
      <LogoMark />
      {siteConfig.name}
    </Link>
  );
}
