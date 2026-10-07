'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { COUNTRIES } from '@/constants/options';
import { queryKeys } from '@/constants/query-keys';
import { handleFormError } from '@/lib/form-errors';
import { getMyBrandProfile, updateMyBrandProfile } from '@/services/brand.service';
import { brandProfileSchema, type BrandProfileValues } from '@/validations/brand.schema';
import { Button, Card, CardBody, ErrorState, FormField, Input, PageHeader, Select, Skeleton, Textarea } from '@/components/ui';

export function BrandProfileForm() {
  const queryCache = useQueryCache();
  const profile = useApiQuery({ queryKey: queryKeys.brand.me, queryFn: getMyBrandProfile });
  const { register, handleSubmit, reset, setError, formState } = useForm<BrandProfileValues>({ resolver: zodResolver(brandProfileSchema) });
  const { errors, isDirty } = formState;

  useEffect(() => {
    if (!profile.data) return;
    const p = profile.data;
    reset({
      companyName: p.companyName,
      website: p.website ?? '',
      industry: p.industry ?? '',
      country: p.country ?? '',
      city: p.city ?? '',
      logoUrl: p.logoUrl ?? '',
      description: p.description ?? '',
    });
  }, [profile.data, reset]);

  const mutation = useApiMutation({
    mutationFn: (v: BrandProfileValues) => updateMyBrandProfile({ ...v, country: v.country || undefined }),
    onSuccess: (data) => {
      queryCache.setData(queryKeys.brand.me, data);
      queryCache.invalidate(queryKeys.me);
      toast.success('Company profile saved');
    },
    onError: (e) => handleFormError(e, setError, ['companyName', 'website', 'industry', 'country', 'city', 'logoUrl', 'description']),
  });

  if (profile.isPending) return <Skeleton className="h-96" />;
  if (profile.isError) return <ErrorState message={profile.error.message} onRetry={() => profile.refetch()} />;

  return (
    <>
      <PageHeader title="Company profile" description="Creators see this when you send them a request. A complete profile gets more replies." />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Company name" htmlFor="companyName" error={errors.companyName?.message} required>
                <Input id="companyName" invalid={!!errors.companyName} {...register('companyName')} />
              </FormField>
              <FormField label="Website" htmlFor="website" error={errors.website?.message}>
                <Input id="website" type="url" placeholder="https://…" invalid={!!errors.website} {...register('website')} />
              </FormField>
              <FormField label="Industry" htmlFor="industry" error={errors.industry?.message}>
                <Input id="industry" placeholder="e.g. Food & beverage" invalid={!!errors.industry} {...register('industry')} />
              </FormField>
              <FormField label="Logo URL" htmlFor="logoUrl" error={errors.logoUrl?.message}>
                <Input id="logoUrl" type="url" placeholder="https://…" invalid={!!errors.logoUrl} {...register('logoUrl')} />
              </FormField>
              <FormField label="Country" htmlFor="country" error={errors.country?.message}>
                <Select id="country" {...register('country')}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="City" htmlFor="city" error={errors.city?.message}>
                <Input id="city" invalid={!!errors.city} {...register('city')} />
              </FormField>
            </div>
            <FormField label="About the company" htmlFor="description" error={errors.description?.message}>
              <Textarea id="description" rows={4} invalid={!!errors.description} {...register('description')} />
            </FormField>
            <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
              <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>
                Save
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
