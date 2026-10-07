/**
 * Centralised, validated public env. NEXT_PUBLIC_* values are inlined at build time,
 * so they must be referenced statically (no dynamic process.env[key]).
 */
function required(name: string, value: string | undefined, fallback?: string): string {
  const v = value || fallback;
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v.replace(/\/$/, '');
}

export const env = {
  apiUrl: required('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL, 'http://localhost:4000/api/v1'),
  siteUrl: required('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'),
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'SocialScope',
} as const;

/** Server-only: prefer a private URL when available. */
export const serverApiUrl = () => (process.env.API_INTERNAL_URL || env.apiUrl).replace(/\/$/, '');
