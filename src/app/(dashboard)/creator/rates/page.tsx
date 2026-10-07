import type { Metadata } from 'next';
import { RateCardsView } from '@/components/dashboard/rate-cards-view';

export const metadata: Metadata = { title: 'Rate card' };

export default function Page() {
  return <RateCardsView />;
}
