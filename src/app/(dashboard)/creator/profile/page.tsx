import type { Metadata } from 'next';
import { CreatorProfileForm } from '@/components/dashboard/creator-profile-form';

export const metadata: Metadata = { title: 'Profile' };

export default function CreatorProfilePage() {
  return <CreatorProfileForm />;
}
