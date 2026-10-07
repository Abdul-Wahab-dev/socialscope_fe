'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { DELIVERABLES, PLATFORMS } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { handleFormError } from '@/lib/form-errors';
import { formatMoney } from '@/lib/utils';
import { createRateCard, deleteRateCard, getRateCards, updateRateCard } from '@/services/creator.service';
import type { RateCard } from '@/types/creator';
import { rateCardSchema, type RateCardValues } from '@/validations/creator.schema';
import { Button, Card, Dialog, EmptyState, ErrorState, FormField, Input, PageHeader, Select, Skeleton, Textarea } from '@/components/ui';
import { platformLabel } from '@/components/creators/platform-badge';

function RateCardForm({ initial, onDone }: { initial?: RateCard; onDone: () => void }) {
  const queryCache = useQueryCache();
  const { register, handleSubmit, setError, formState } = useForm<RateCardValues>({
    resolver: zodResolver(rateCardSchema),
    defaultValues: initial
      ? { platform: initial.platform, deliverable: initial.deliverable, title: initial.title, description: initial.description ?? '', price: initial.priceCents / 100, currency: initial.currency }
      : { platform: 'instagram', deliverable: 'reel', title: '', description: '', price: undefined as unknown as number, currency: 'USD' },
  });
  const { errors } = formState;

  const mutation = useApiMutation({
    mutationFn: (v: RateCardValues) => (initial ? updateRateCard(initial.id, v) : createRateCard(v)),
    onSuccess: () => {
      toast.success(initial ? 'Rate updated' : 'Rate added');
      queryCache.invalidate(queryKeys.creator.rateCards);
      queryCache.invalidate(queryKeys.creator.me);
      onDone();
    },
    onError: (e) => handleFormError(e, setError, ['platform', 'deliverable', 'title', 'description', 'price']),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Platform" htmlFor="r-platform" error={errors.platform?.message}>
          <Select id="r-platform" {...register('platform', { setValueAs: (v) => v || null })}>
            <option value="">Any / cross-platform</option>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Deliverable" htmlFor="r-deliverable" error={errors.deliverable?.message}>
          <Select id="r-deliverable" {...register('deliverable')}>
            {DELIVERABLES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <FormField label="Title" htmlFor="r-title" error={errors.title?.message} required>
        <Input id="r-title" placeholder="e.g. 1 Instagram Reel + 3 Stories" invalid={!!errors.title} {...register('title')} />
      </FormField>
      <FormField label="Price (USD)" htmlFor="r-price" error={errors.price?.message} required>
        <Input id="r-price" type="number" min={0} step="0.01" invalid={!!errors.price} {...register('price', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Details" htmlFor="r-desc" error={errors.description?.message} hint="What’s included: revisions, usage rights, turnaround time…">
        <Textarea id="r-desc" rows={3} invalid={!!errors.description} {...register('description')} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {initial ? 'Save changes' : 'Add rate'}
        </Button>
      </div>
    </form>
  );
}

export function RateCardsView() {
  const queryCache = useQueryCache();
  const [editing, setEditing] = useState<RateCard | 'new' | null>(null);
  const cards = useApiQuery({ queryKey: queryKeys.creator.rateCards, queryFn: getRateCards });
  const deliverableLabel = (d: string) => DELIVERABLES.find((x) => x.value === d)?.label ?? d;

  const remove = useApiMutation({
    mutationFn: deleteRateCard,
    onSuccess: () => {
      toast.success('Rate removed');
      queryCache.invalidate(queryKeys.creator.rateCards);
      queryCache.invalidate(queryKeys.creator.me);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Rate card"
        description="Publishing prices saves brands a round of back-and-forth and gets you better-qualified requests."
        action={
          <Button onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" /> Add rate
          </Button>
        }
      />
      {cards.isPending ? (
        <Skeleton className="h-64" />
      ) : cards.isError ? (
        <ErrorState message={cards.error.message} onRetry={() => cards.refetch()} />
      ) : cards.data.length === 0 ? (
        <EmptyState icon={<Tags className="h-8 w-8" />} title="No rates yet" description="Add your first rate, e.g. “1 Instagram Reel”." action={<Button onClick={() => setEditing('new')}>Add rate</Button>} />
      ) : (
        <Card>
          <ul className="divide-y divide-zinc-100">
            {cards.data.map((r) => (
              <li key={r.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-zinc-500">
                    {deliverableLabel(r.deliverable)} · {r.platform ? platformLabel(r.platform) : 'Any platform'}
                  </p>
                </div>
                <p className="font-semibold">{formatMoney(r.priceCents, r.currency)}</p>
                <Button variant="ghost" size="icon" onClick={() => setEditing(r)} aria-label="Edit rate">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirm('Delete this rate?') && remove.mutate(r.id)}
                  disabled={remove.isPending && remove.variables === r.id}
                  aria-label="Delete rate"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add a rate' : 'Edit rate'}>
        {editing !== null && <RateCardForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />}
      </Dialog>
    </>
  );
}
