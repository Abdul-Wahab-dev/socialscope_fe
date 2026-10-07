export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube';
export type DeliverableType = 'post' | 'reel' | 'story' | 'video' | 'short' | 'live' | 'ugc' | 'other';

export interface Category {
  slug: string;
  name: string;
  sortOrder: number;
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  profileUrl: string | null;
  avatarUrl: string | null;
  followers: number;
  following?: number;
  postsCount: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  syncStatus?: 'pending' | 'ok' | 'error';
  syncError?: string | null;
  lastSyncedAt: string | null;
}

export interface RateCard {
  id: string;
  platform: SocialPlatform | null;
  deliverable: DeliverableType;
  title: string;
  description: string | null;
  priceCents: number;
  currency: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  brandName: string | null;
  url: string | null;
  description: string | null;
}

export interface ListingChecklist {
  ready: boolean;
  items: { key: string; label: string; done: boolean }[];
}

export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  categories: string[];
  languages: string[];
  country: string | null;
  city: string | null;
  contactEmail: string | null;
  isAvailable: boolean;
  isListed: boolean;
  isFounding: boolean;
  listedAt: string | null;
  totalFollowers: number;
  avgEngagementRate: number;
  minPriceCents: number | null;
  profileViews: number;
  searchAppearances: number;
  socialAccounts: SocialAccount[];
  rateCards: RateCard[];
  portfolioItems: PortfolioItem[];
  listingChecklist: ListingChecklist;
}

export type PublicCreatorProfile = Omit<CreatorProfile, 'contactEmail' | 'listedAt' | 'profileViews' | 'searchAppearances' | 'listingChecklist'> & {
  isOwnerPreview: boolean;
  createdAt: string;
};

export interface CreatorCardData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  categories: string[];
  languages: string[];
  country: string | null;
  city: string | null;
  isAvailable: boolean;
  isFounding: boolean;
  totalFollowers: number;
  avgEngagementRate: number;
  minPriceCents: number | null;
  isSaved?: boolean;
  socialAccounts: Pick<SocialAccount, 'platform' | 'handle' | 'followers' | 'engagementRate' | 'avgViews'>[];
}

export interface CreatorInsights {
  profileViews: number;
  searchAppearances: number;
  totalFollowers: number;
  avgEngagementRate: number;
  history: { platform: SocialPlatform; followers: number; engagementRate: number; capturedAt: string }[];
}
