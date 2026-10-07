import type { Metadata } from 'next';
import { BrandProfileForm } from '@/components/dashboard/brand-profile-form';

export const metadata: Metadata = { title: 'Company profile' };

export default function Page() {
  return <BrandProfileForm />;
}
