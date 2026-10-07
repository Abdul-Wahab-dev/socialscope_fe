export type UserRole = 'creator' | 'brand' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'active' | 'suspended';
  searchCredits: number;
  lastLoginAt: string | null;
  createdAt: string;
  creatorProfile?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isListed: boolean;
    isFounding: boolean;
  } | null;
  brandProfile?: { id: string; companyName: string; logoUrl: string | null } | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
