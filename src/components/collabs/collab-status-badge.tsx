import type { CollabStatus } from '@/types/collab';
import { Badge, type BadgeTone } from '@/components/ui';

const map: Record<CollabStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  countered: { label: 'Counter-offer', tone: 'info' },
  accepted: { label: 'Accepted', tone: 'success' },
  declined: { label: 'Declined', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  completed: { label: 'Completed', tone: 'brand' },
};

export function CollabStatusBadge({ status }: { status: CollabStatus }) {
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
