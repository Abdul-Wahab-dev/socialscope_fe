import type { Metadata } from 'next';
import { BrandOverview } from '@/components/dashboard/brand-overview';

export const metadata: Metadata = { title: 'Brand dashboard' };

export default function BrandDashboardPage() {
  return <BrandOverview />;
}
