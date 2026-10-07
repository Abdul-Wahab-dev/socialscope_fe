import type { Metadata } from 'next';
import { SavedCreatorsView } from '@/components/dashboard/saved-creators-view';

export const metadata: Metadata = { title: 'Saved creators' };

export default function Page() {
  return <SavedCreatorsView />;
}
