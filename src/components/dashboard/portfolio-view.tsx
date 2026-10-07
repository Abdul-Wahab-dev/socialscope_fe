'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { ExternalLink, Images, Pencil, Plus, Trash2 } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { handleFormError } from '@/lib/form-errors';
import { createPortfolioItem, deletePortfolioItem, getPortfolio, updatePortfolioItem } from '@/services/creator.service';
import type { PortfolioItem } from '@/types/creator';
import { portfolioItemSchema, type PortfolioItemValues } from '@/validations/creator.schema';
import { Button, Card, Dialog, EmptyState, ErrorState, FormField, Input, PageHeader, Skeleton, Textarea } from '@/components/ui';

function PortfolioForm({ initial, onDone }: { initial?: PortfolioItem; onDone: () => void }) {
  const queryCache = useQueryCache();
  const { register, handleSubmit, setError, formState } = useForm<PortfolioItemValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: { title: initial?.title ?? '', brandName: initial?.brandName ?? '', url: initial?.url ?? '', description: initial?.description ?? '' },
  });
  const { errors } = formState;

  const mutation = useApiMutation({
    mutationFn: (v: PortfolioItemValues) => (initial ? updatePortfolioItem(initial.id, v) : createPortfolioItem(v)),
    onSuccess: () => {
      toast.success(initial ? 'Item updated' : 'Item added');
      queryCache.invalidate(queryKeys.creator.portfolio);
      onDone();
    },
    onError: (e) => handleFormError(e, setError, ['title', 'brandName', 'url', 'description']),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <FormField label="Title" htmlFor="p-title" error={errors.title?.message} required>
        <Input id="p-title" placeholder="e.g. Eid collection launch reel" invalid={!!errors.title} {...register('title')} />
      </FormField>
      <FormField label="Brand" htmlFor="p-brand" error={errors.brandName?.message}>
        <Input id="p-brand" invalid={!!errors.brandName} {...register('brandName')} />
      </FormField>
      <FormField label="Link to the content" htmlFor="p-url" error={errors.url?.message}>
        <Input id="p-url" type="url" placeholder="https://…" invalid={!!errors.url} {...register('url')} />
      </FormField>
      <FormField label="Results / notes" htmlFor="p-desc" error={errors.description?.message} hint="e.g. 1.2M views, 4.8% engagement, 300 promo-code uses">
        <Textarea id="p-desc" rows={3} invalid={!!errors.description} {...register('description')} />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {initial ? 'Save changes' : 'Add item'}
        </Button>
      </div>
    </form>
  );
}

export function PortfolioView() {
  const queryCache = useQueryCache();
  const [editing, setEditing] = useState<PortfolioItem | 'new' | null>(null);
  const items = useApiQuery({ queryKey: queryKeys.creator.portfolio, queryFn: getPortfolio });

  const remove = useApiMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success('Item removed');
      queryCache.invalidate(queryKeys.creator.portfolio);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Show past brand work. Results sell better than follower counts."
        action={
          <Button onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        }
      />
      {items.isPending ? (
        <Skeleton className="h-64" />
      ) : items.isError ? (
        <ErrorState message={items.error.message} onRetry={() => items.refetch()} />
      ) : items.data.length === 0 ? (
        <EmptyState icon={<Images className="h-8 w-8" />} title="No past collaborations yet" action={<Button onClick={() => setEditing('new')}>Add your first</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.data.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.title}</p>
                  {p.brandName && <p className="text-sm text-zinc-500">{p.brandName}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditing(p)} aria-label="Edit item">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => confirm('Delete this item?') && remove.mutate(p.id)} aria-label="Delete item">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              {p.description && <p className="mt-2 text-sm text-zinc-600">{p.description}</p>}
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
                  View content <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add portfolio item' : 'Edit portfolio item'}>
        {editing !== null && <PortfolioForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />}
      </Dialog>
    </>
  );
}
