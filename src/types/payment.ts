export type PaymentPurpose = 'creator_registration' | 'search_credits';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  credits: number;
  packageId: string | null;
  provider: 'stripe' | 'mock' | 'founding';
  paidAt: string | null;
  createdAt: string;
}

export interface CheckoutResult {
  activated: boolean;
  paymentId: string | null;
  checkoutUrl: string | null;
}

export interface SearchCreditPackage {
  id: string;
  name: string;
  credits: number;
  priceCents: number;
}

export interface PublicConfig {
  currency: string;
  creatorRegistrationFeeCents: number;
  foundingSlotsRemaining: number;
  guestSearchLimit: number;
  weeklyFreeSearchLimit: number;
  searchCreditPackages: SearchCreditPackage[];
  platforms: string[];
  deliverableTypes: string[];
  paymentsMode: 'mock' | 'stripe';
  socialMode: 'mock' | 'live';
}

export interface PublicStats {
  listedCreators: number;
  totalReach: number;
  countries: number;
  categoryCounts: Record<string, number>;
  platformCounts: Record<string, number>;
}
