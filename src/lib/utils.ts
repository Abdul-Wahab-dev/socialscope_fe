import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCompact = (n: number | null | undefined) => compact.format(Number(n ?? 0));

export function formatMoney(cents: number | null | undefined, currency = 'USD') {
  if (cents === null || cents === undefined) return '—';
  return new Intl.NumberFormat('en', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

export const formatPercent = (n: number | null | undefined) => `${Number(n ?? 0).toFixed(2)}%`;

export function formatDate(value: string | Date | null | undefined, opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', opts).format(new Date(value));
}

export function timeAgo(value: string | Date | null | undefined) {
  if (!value) return 'never';
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, secs] of units) if (Math.abs(diff) >= secs) return rtf.format(-Math.round(diff / secs), unit);
  return 'just now';
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

/** Removes empty values so they don't end up in query strings. */
export function cleanParams<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0) && v !== false),
  ) as Partial<T>;
}
