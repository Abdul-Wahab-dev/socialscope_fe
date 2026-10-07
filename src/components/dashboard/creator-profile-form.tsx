'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { COUNTRIES, LANGUAGES } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { useMyCreatorProfile } from '@/hooks/use-creator';
import { useCategories } from '@/hooks/use-meta';
import { handleFormError } from '@/lib/form-errors';
import { cn } from '@/lib/utils';
import { updateMyCreatorProfile } from '@/services/creator.service';
import { creatorProfileSchema, type CreatorProfileValues } from '@/validations/creator.schema';
import { Button, Card, CardBody, ErrorState, FormField, Input, PageHeader, Select, Skeleton, Switch, Textarea } from '@/components/ui';

const FIELDS = ['username', 'displayName', 'bio', 'avatarUrl', 'categories', 'languages', 'country', 'city', 'contactEmail', 'isAvailable'];

function ChipSelect({ options, value, onChange, max }: { options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void; max: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            disabled={!active && value.length >= max}
            onClick={() => onChange(active ? value.filter((v) => v !== o.value) : [...value, o.value])}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40',
              active ? 'border-brand-600 bg-brand-600 text-white' : 'border-zinc-300 text-zinc-700 hover:border-zinc-400',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function CreatorProfileForm() {
  const profile = useMyCreatorProfile();
  const { data: categories = [] } = useCategories();
  const queryCache = useQueryCache();

  const form = useForm<CreatorProfileValues>({ resolver: zodResolver(creatorProfileSchema) });
  const { register, control, handleSubmit, reset, setError, formState } = form;
  const { errors, isDirty } = formState;

  useEffect(() => {
    if (!profile.data) return;
    const p = profile.data;
    reset({
      username: p.username,
      displayName: p.displayName,
      bio: p.bio ?? '',
      avatarUrl: p.avatarUrl ?? '',
      categories: p.categories,
      languages: p.languages,
      country: p.country ?? '',
      city: p.city ?? '',
      contactEmail: p.contactEmail ?? '',
      isAvailable: p.isAvailable,
    });
  }, [profile.data, reset]);

  const mutation = useApiMutation({
    mutationFn: updateMyCreatorProfile,
    onSuccess: (data) => {
      queryCache.setData(queryKeys.creator.me, data);
      queryCache.invalidate(queryKeys.me);
      toast.success('Profile saved');
    },
    onError: (e) => handleFormError(e, setError, FIELDS),
  });

  if (profile.isPending) return <Skeleton className="h-[600px]" />;
  if (profile.isError) return <ErrorState message={profile.error.message} onRetry={() => profile.refetch()} />;

  return (
    <>
      <PageHeader title="Profile" description="This is what brands see on your media kit and in search results." />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Display name" htmlFor="displayName" error={errors.displayName?.message} required>
                <Input id="displayName" invalid={!!errors.displayName} {...register('displayName')} />
              </FormField>
              <FormField label="Username" htmlFor="username" error={errors.username?.message} hint="Changing it changes your public link" required>
                <Input id="username" invalid={!!errors.username} {...register('username')} />
              </FormField>
            </div>

            <FormField label="Bio" htmlFor="bio" error={errors.bio?.message} hint="What you create, who your audience is, brands you’ve loved working with.">
              <Textarea id="bio" rows={4} maxLength={1000} invalid={!!errors.bio} {...register('bio')} />
            </FormField>

            <FormField label="Avatar URL" htmlFor="avatarUrl" error={errors.avatarUrl?.message} hint="Leave empty to use your connected social profile picture.">
              <Input id="avatarUrl" type="url" placeholder="https://…" invalid={!!errors.avatarUrl} {...register('avatarUrl')} />
            </FormField>

            <FormField label="Categories (up to 5)" error={errors.categories?.message} required>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <ChipSelect options={categories.map((c) => ({ value: c.slug, label: c.name }))} value={field.value ?? []} onChange={field.onChange} max={5} />
                )}
              />
            </FormField>

            <FormField label="Content languages" error={errors.languages?.message}>
              <Controller
                control={control}
                name="languages"
                render={({ field }) => (
                  <ChipSelect options={LANGUAGES.map((l) => ({ value: l, label: l[0]!.toUpperCase() + l.slice(1) }))} value={field.value ?? []} onChange={field.onChange} max={8} />
                )}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Country" htmlFor="country" error={errors.country?.message} required>
                <Select id="country" invalid={!!errors.country} {...register('country')}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="City" htmlFor="city" error={errors.city?.message}>
                <Input id="city" placeholder="e.g. Lahore" invalid={!!errors.city} {...register('city')} />
              </FormField>
            </div>

            <FormField label="Business email" htmlFor="contactEmail" error={errors.contactEmail?.message} hint="Private. Used for collab notifications, never shown publicly.">
              <Input id="contactEmail" type="email" invalid={!!errors.contactEmail} {...register('contactEmail')} />
            </FormField>

            <Controller
              control={control}
              name="isAvailable"
              render={({ field }) => <Switch id="isAvailable" checked={Boolean(field.value)} onChange={field.onChange} label="Open for new collaborations" />}
            />

            <div className="flex justify-end gap-2 border-t border-zinc-100 pt-5">
              <Button variant="secondary" disabled={!isDirty || mutation.isPending} onClick={() => profile.data && reset()}>
                Discard changes
              </Button>
              <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>
                Save profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
