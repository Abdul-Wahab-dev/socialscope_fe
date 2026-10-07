import type { Metadata } from 'next';
import { CollabsListView } from '@/components/collabs/collabs-list-view';

export const metadata: Metadata = { title: 'Collaborations' };

export default function CollabsPage() {
  return <CollabsListView />;
}
