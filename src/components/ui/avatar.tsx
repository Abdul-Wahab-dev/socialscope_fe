import { cn, initials } from '@/lib/utils';

const gradients = [
  'from-brand-500 to-accent-500',
  'from-accent-500 to-warm-400',
  'from-sky-500 to-brand-500',
  'from-emerald-500 to-sky-500',
  'from-amber-400 to-accent-500',
  'from-brand-700 to-sky-500',
];

/** Picks a stable gradient per name so fallback avatars look intentional, not empty. */
function gradientFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return gradients[h % gradients.length];
}

/** Remote avatars come from many CDNs, so a plain <img> avoids next/image domain config. */
export function Avatar({ src, name, size = 40, className, ring }: { src?: string | null; name: string; size?: number; className?: string; ring?: boolean }) {
  const ringCls = ring && 'ring-4 ring-white';
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} className={cn('shrink-0 rounded-full object-cover', ringCls, className)} style={{ width: size, height: size }} />
  ) : (
    <div
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white', gradientFor(name), ringCls, className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name) || '?'}
    </div>
  );
}
