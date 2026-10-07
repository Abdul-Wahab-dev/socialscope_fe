import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollabDetailView } from '@/components/collabs/collab-detail-view';

export const metadata: Metadata = { title: 'Collaboration' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function CollabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  return <CollabDetailView id={id} />;
}
