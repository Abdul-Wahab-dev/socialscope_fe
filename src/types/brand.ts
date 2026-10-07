import type { CreatorCardData } from './creator';

export interface BrandProfile {
  id: string;
  companyName: string;
  website: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  logoUrl: string | null;
  description: string | null;
}

export interface SavedCreator {
  id: string;
  note: string | null;
  createdAt: string;
  creatorProfile: Omit<CreatorCardData, 'socialAccounts' | 'bio' | 'languages' | 'isFounding'> & { isListed: boolean };
}
