import type { PaginationMeta } from './api';
import type { SocialPlatform } from './creator';

export type SearchSort = 'relevance' | 'followers_desc' | 'engagement_desc' | 'price_asc' | 'newest';

export interface SearchFilters {
  q?: string;
  categories?: string[];
  platform?: SocialPlatform;
  country?: string;
  city?: string;
  language?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

export type SearchQuota =
  | { type: 'guest'; used: number; limit: number; remaining: number }
  | { type: 'user'; weeklyUsed: number; weeklyLimit: number; weeklyRemaining: number; credits: number; resetsAt: string };

export type SearchMeta = PaginationMeta & { quota: SearchQuota };
