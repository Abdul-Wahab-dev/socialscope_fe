'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation, useQueryCache } from '@/lib/query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { DELIVERABLES, PLATFORMS } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { handleFormError } from '@/lib/form-errors';
import { createCollab } from '@/services/collab.service';
import type { SocialPlatform } from '@/types/creator';
import { collabRequestSchema, type CollabRequestValues } from '@/validations/collab.schema';
import { Button, Dialog, FormField, Input, Select, Textarea } from '@/components/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  creator: { id: string; displayName: string; platforms: SocialPlatform[] };
}

export function CollabRequestDialog({ open, onClose, creator }: Props) {
  const router = useRouter();
  const queryCache = useQueryCache();
  const form = useForm<CollabRequestValues>({
    resolver: zodResolver(collabRequestSchema),
    defaultValues: {
      title: '',
      brief: '',
      deliverables: [{ platform: creator.platforms[0], type: 'reel', quantity: 1 }],
      budget: undefined as unknown as number,
      currency: 'USD',
      deadline: '',
    },
  });
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({ control, name: 'deliverables' });

  const mutation = useApiMutation({
    mutationFn: (values: CollabRequestValues) => createCollab({ ...values, deadline: values.deadline || undefined, creatorProfileId: creator.id }),
    onSuccess: (collab) => {
      toast.success(`Request sent to ${creator.displayName}`);
      queryCache.invalidate(queryKeys.collabs.all);
      onClose();
      router.push(routes.collabs.detail(collab.id));
    },
    onError: (error) => {
      const appError = handleFormError(error, setError, ['title', 'brief', 'budget', 'deadline', 'deliverables']);
      const existing = (appError.details as { collabId?: string } | undefined)?.collabId;
      if (appError.code === 'CONFLICT' && existing) router.push(routes.collabs.detail(existing));
    },
  });

  return (
    <Dialog open={open} onClose={onClose} title={`Collab request to ${creator.displayName}`} description="Be specific: clear briefs get faster replies." className="max-w-2xl">
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
        <FormField label="Campaign title" htmlFor="c-title" error={errors.title?.message} required>
          <Input id="c-title" placeholder="e.g. Summer skincare launch" invalid={!!errors.title} {...register('title')} />
        </FormField>
        <FormField label="Brief" htmlFor="c-brief" error={errors.brief?.message} hint="Product, key messages, do’s and don’ts, links." required>
          <Textarea id="c-brief" rows={5} invalid={!!errors.brief} {...register('brief')} />
        </FormField>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-800">Deliverables</legend>
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_80px_auto] items-start gap-2">
              <Select aria-label="Platform" {...register(`deliverables.${i}.platform`, { setValueAs: (v) => v || undefined })}>
                <option value="">Any platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <Select aria-label="Type" {...register(`deliverables.${i}.type`)}>
                {DELIVERABLES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
              <Input aria-label="Quantity" type="number" min={1} max={100} invalid={!!errors.deliverables?.[i]?.quantity} {...register(`deliverables.${i}.quantity`, { valueAsNumber: true })} />
              <Button variant="ghost" size="icon" onClick={() => remove(i)} disabled={fields.length === 1} aria-label="Remove deliverable">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.deliverables?.message && <p className="text-xs text-red-600">{errors.deliverables.message}</p>}
          {fields.length < 10 && (
            <Button variant="ghost" size="sm" onClick={() => append({ type: 'post', quantity: 1 })}>
              <Plus className="h-4 w-4" /> Add deliverable
            </Button>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Total budget (USD)" htmlFor="c-budget" error={errors.budget?.message} required>
            <Input id="c-budget" type="number" min={1} step="1" invalid={!!errors.budget} {...register('budget', { valueAsNumber: true })} />
          </FormField>
          <FormField label="Deadline" htmlFor="c-deadline" error={errors.deadline?.message}>
            <Input id="c-deadline" type="date" min={new Date().toISOString().slice(0, 10)} invalid={!!errors.deadline} {...register('deadline')} />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Send request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
