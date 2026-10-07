/** Deterministic decorative gradients so every creator gets a consistent cover. */
const covers = [
  'from-brand-500 via-brand-400 to-accent-400',
  'from-accent-500 via-pink-400 to-warm-400',
  'from-sky-500 via-brand-400 to-brand-600',
  'from-emerald-400 via-sky-400 to-brand-500',
  'from-warm-400 via-accent-400 to-brand-500',
  'from-brand-800 via-brand-600 to-accent-500',
];

export function coverFor(key: string) {
  let h = 0;
  for (const ch of key) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return covers[h % covers.length];
}
