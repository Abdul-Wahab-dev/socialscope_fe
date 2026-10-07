import type { DeliverableType, SocialPlatform } from './creator';

export type CollabStatus = 'pending' | 'accepted' | 'declined' | 'countered' | 'cancelled' | 'completed';

export interface CollabDeliverable {
  platform?: SocialPlatform;
  type: DeliverableType;
  quantity: number;
  notes?: string;
}

export interface CollabRequest {
  id: string;
  title: string;
  brief: string;
  deliverables: CollabDeliverable[];
  budgetCents: number;
  counterCents: number | null;
  currency: string;
  deadline: string | null;
  status: CollabStatus;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  creatorProfile: { id: string; username: string; displayName: string; avatarUrl: string | null };
  brandUser: { id: string; fullName: string; brandProfile: { companyName: string; logoUrl: string | null; website: string | null } | null };
}

export interface Message {
  id: string;
  collabRequestId: string;
  senderUserId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  sender: { id: string; fullName: string; role: string };
}
