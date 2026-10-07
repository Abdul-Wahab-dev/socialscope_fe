import type { SocialPlatform } from '@/types/creator';
import { cn } from '@/lib/utils';

const meta: Record<SocialPlatform, { label: string; short: string; className: string; soft: string }> = {
  instagram: { label: 'Instagram', short: 'IG', className: 'bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white', soft: 'bg-pink-50 text-pink-700 ring-pink-200/70' },
  tiktok: { label: 'TikTok', short: 'TT', className: 'bg-zinc-950 text-white', soft: 'bg-zinc-100 text-zinc-800 ring-zinc-200' },
  youtube: { label: 'YouTube', short: 'YT', className: 'bg-red-600 text-white', soft: 'bg-red-50 text-red-700 ring-red-200/70' },
};

export const platformLabel = (p: SocialPlatform) => meta[p].label;
export const platformSoftClass = (p: SocialPlatform) => meta[p].soft;

/** Compact platform marker (text-based to avoid shipping third-party logos). */
export function PlatformBadge({ platform, size = 28, className }: { platform: SocialPlatform; size?: number; className?: string }) {
  const m = meta[platform];
  return (
    <span
      title={m.label}
      aria-label={m.label}
      className={cn('inline-flex shrink-0 items-center justify-center font-bold tracking-tight', m.className, className)}
      style={{ width: size, height: size, fontSize: size * 0.36, borderRadius: size * 0.3 }}
    >
      {m.short}
    </span>
  );
}
