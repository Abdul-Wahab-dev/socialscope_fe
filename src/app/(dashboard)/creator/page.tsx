import type { Metadata } from 'next';
import { CreatorOverview } from '@/components/dashboard/creator-overview';

export const metadata: Metadata = { title: 'Creator dashboard' };

export default function CreatorDashboardPage() {
  return <CreatorOverview />;
}
