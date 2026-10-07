import type { DeliverableType, SocialPlatform } from '@/types/creator';

export const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

export const DELIVERABLES: { value: DeliverableType; label: string }[] = [
  { value: 'post', label: 'Feed post' },
  { value: 'reel', label: 'Reel' },
  { value: 'story', label: 'Story' },
  { value: 'video', label: 'Long video' },
  { value: 'short', label: 'Short video' },
  { value: 'live', label: 'Live stream' },
  { value: 'ugc', label: 'UGC (for brand’s own channels)' },
  { value: 'other', label: 'Other' },
];

export const FOLLOWER_TIERS = [
  { label: 'Any size', min: undefined, max: undefined },
  { label: 'Nano (1K–10K)', min: 1_000, max: 10_000 },
  { label: 'Micro (10K–100K)', min: 10_000, max: 100_000 },
  { label: 'Mid (100K–500K)', min: 100_000, max: 500_000 },
  { label: 'Macro (500K+)', min: 500_000, max: undefined },
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best match' },
  { value: 'followers_desc', label: 'Most followers' },
  { value: 'engagement_desc', label: 'Highest engagement' },
  { value: 'price_asc', label: 'Lowest price' },
  { value: 'newest', label: 'Newest' },
] as const;

export const LANGUAGES = ['english', 'urdu', 'hindi', 'arabic', 'punjabi', 'spanish', 'french', 'turkish'];

/** Compact list; extend as you expand to new markets. */
export const COUNTRIES: { code: string; name: string }[] = [
  { code: 'PK', name: 'Pakistan' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'TR', name: 'Turkey' },
  { code: 'QA', name: 'Qatar' },
  { code: 'MY', name: 'Malaysia' },
];

export const countryName = (code?: string | null) => COUNTRIES.find((c) => c.code === code)?.name ?? code ?? '';
