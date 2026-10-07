'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { DELIVERABLES } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { formatDate, formatMoney } from '@/lib/utils';
import { cancelCollab, completeCollab, getCollab, respondToCollab, respondToCounter } from '@/services/collab.service';
import type { CollabRequest } from '@/types/collab';
import type { RespondCollabValues } from '@/validations/collab.schema';
import { Alert, Avatar, Button, Card, CardBody, CardHeader, Dialog, ErrorState, FormField, Input, Skeleton, Textarea } from '@/components/ui';
import { platformLabel } from '@/components/creators/platform-badge';
import { CollabStatusBadge } from './collab-status-badge';
import { MessageThread } from './message-thread';

function CounterDialog({ collab, open, onClose, onSubmit, loading }: { collab: CollabRequest; open: boolean; onClose: () => void; onSubmit: (v: RespondCollabValues) => void; loading: boolean }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n < 1) return setError('Enter an amount of at least 1');
    if (n > 1_000_000) return setError('Amount is too high');
    setError(null);
    onSubmit({ action: 'counter', counterBudget: n, message: message.trim() || undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} title="Counter-offer" description={`Brand’s budget: ${formatMoney(collab.budgetCents, collab.currency)}`}>
      <div className="space-y-4">
        <FormField label={`Your price (${collab.currency})`} htmlFor="counter" error={error ?? undefined} required>
          <Input id="counter" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} invalid={!!error} />
        </FormField>
        <FormField label="Message (optional)" htmlFor="counter-msg">
          <Textarea id="counter-msg" rows={3} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Explain what’s included at this price…" />
        </FormField>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={loading}>
            Send counter-offer
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export function CollabDetailView({ id }: { id: string }) {
  const { user } = useAuth();
  const queryCache = useQueryCache();
  const [counterOpen, setCounterOpen] = useState(false);
  const collab = useApiQuery({ queryKey: queryKeys.collabs.detail(id), queryFn: () => getCollab(id) });

  const onUpdated = (data: CollabRequest, message: string) => {
    queryCache.setData(queryKeys.collabs.detail(id), data);
    queryCache.invalidate(queryKeys.collabs.all);
    toast.success(message);
  };

  const respond = useApiMutation({
    mutationFn: (v: RespondCollabValues) => respondToCollab(id, v),
    onSuccess: (data, v) => {
      setCounterOpen(false);
      queryCache.invalidate(queryKeys.collabs.messages(id));
      onUpdated(data, v.action === 'accept' ? 'Collaboration accepted 🎉' : v.action === 'decline' ? 'Request declined' : 'Counter-offer sent');
    },
    onError: (e) => toast.error(e.message),
  });
  const counterResponse = useApiMutation({
    mutationFn: (action: 'accept' | 'decline') => respondToCounter(id, action),
    onSuccess: (data, action) => onUpdated(data, action === 'accept' ? 'Counter-offer accepted' : 'Counter-offer declined'),
    onError: (e) => toast.error(e.message),
  });
  const cancel = useApiMutation({ mutationFn: () => cancelCollab(id), onSuccess: (d) => onUpdated(d, 'Request cancelled'), onError: (e) => toast.error(e.message) });
  const complete = useApiMutation({ mutationFn: () => completeCollab(id), onSuccess: (d) => onUpdated(d, 'Marked as completed'), onError: (e) => toast.error(e.message) });

  if (collab.isPending) return <Skeleton className="h-[500px]" />;
  if (collab.isError) return <ErrorState message={collab.error.message} onRetry={() => collab.refetch()} />;

  const c = collab.data;
  const isBrand = user?.role === 'brand';
  const isCreator = user?.role === 'creator';
  const brandName = c.brandUser.brandProfile?.companyName ?? c.brandUser.fullName;
  const busy = respond.isPending || counterResponse.isPending || cancel.isPending || complete.isPending;

  return (
    <div className="space-y-6">
      <Link href={routes.collabs.root} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> All collaborations
      </Link>

      <Card>
        <CardHeader title={c.title} description={`Sent ${formatDate(c.createdAt)}`} action={<CollabStatusBadge status={c.status} />} />
        <CardBody className="space-y-5">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Avatar src={c.brandUser.brandProfile?.logoUrl} name={brandName} size={36} />
              <div>
                <p className="text-xs text-zinc-500">Brand</p>
                <p className="text-sm font-medium">
                  {c.brandUser.brandProfile?.website ? (
                    <a href={c.brandUser.brandProfile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {brandName}
                    </a>
                  ) : (
                    brandName
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={c.creatorProfile.avatarUrl} name={c.creatorProfile.displayName} size={36} />
              <div>
                <p className="text-xs text-zinc-500">Creator</p>
                <Link href={routes.creatorPublic(c.creatorProfile.username)} className="text-sm font-medium hover:underline">
                  {c.creatorProfile.displayName}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Budget</p>
              <p className="text-sm font-semibold">{formatMoney(c.budgetCents, c.currency)}</p>
            </div>
            {c.deadline && (
              <div>
                <p className="text-xs text-zinc-500">Deadline</p>
                <p className="inline-flex items-center gap-1 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" /> {formatDate(c.deadline)}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Brief</p>
            <p className="text-sm whitespace-pre-line text-zinc-700">{c.brief}</p>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Deliverables</p>
            <ul className="flex flex-wrap gap-2">
              {c.deliverables.map((d, i) => (
                <li key={i} className="rounded-lg bg-zinc-100 px-3 py-1 text-sm">
                  {d.quantity}× {DELIVERABLES.find((x) => x.value === d.type)?.label ?? d.type}
                  {d.platform ? ` on ${platformLabel(d.platform)}` : ''}
                </li>
              ))}
            </ul>
          </div>

          {c.status === 'countered' && c.counterCents !== null && (
            <Alert tone="info" title={`Counter-offer: ${formatMoney(c.counterCents, c.currency)}`}>
              {isBrand ? 'The creator proposed a different price. Accept to lock it in.' : 'Waiting for the brand to respond to your counter-offer.'}
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {isCreator && c.status === 'pending' && (
              <>
                <Button disabled={busy} loading={respond.isPending && respond.variables?.action === 'accept'} onClick={() => respond.mutate({ action: 'accept' })}>
                  Accept
                </Button>
                <Button variant="secondary" disabled={busy} onClick={() => setCounterOpen(true)}>
                  Counter-offer
                </Button>
                <Button
                  variant="outlineDanger"
                  disabled={busy}
                  loading={respond.isPending && respond.variables?.action === 'decline'}
                  onClick={() => confirm('Decline this request?') && respond.mutate({ action: 'decline' })}
                >
                  Decline
                </Button>
              </>
            )}
            {isBrand && c.status === 'countered' && (
              <>
                <Button disabled={busy} loading={counterResponse.isPending && counterResponse.variables === 'accept'} onClick={() => counterResponse.mutate('accept')}>
                  Accept {formatMoney(c.counterCents, c.currency)}
                </Button>
                <Button variant="outlineDanger" disabled={busy} loading={counterResponse.isPending && counterResponse.variables === 'decline'} onClick={() => counterResponse.mutate('decline')}>
                  Decline counter
                </Button>
              </>
            )}
            {isBrand && (c.status === 'pending' || c.status === 'countered') && (
              <Button variant="ghost" disabled={busy} loading={cancel.isPending} onClick={() => confirm('Cancel this request?') && cancel.mutate()}>
                Cancel request
              </Button>
            )}
            {isBrand && c.status === 'accepted' && (
              <Button disabled={busy} loading={complete.isPending} onClick={() => complete.mutate()}>
                Mark as completed
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Messages" description="Keep all deal communication here so both sides have a record." />
        {user && <MessageThread collabId={c.id} currentUserId={user.id} disabled={c.status === 'declined' || c.status === 'cancelled'} />}
      </Card>

      <CounterDialog collab={c} open={counterOpen} onClose={() => setCounterOpen(false)} onSubmit={(v) => respond.mutate(v)} loading={respond.isPending} />
    </div>
  );
}
