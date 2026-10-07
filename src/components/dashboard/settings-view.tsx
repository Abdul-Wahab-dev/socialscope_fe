'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { handleFormError } from '@/lib/form-errors';
import { changePassword } from '@/services/auth.service';
import { changePasswordSchema, type ChangePasswordValues } from '@/validations/auth.schema';
import { Button, Card, CardBody, CardHeader, FormField, Input, PageHeader } from '@/components/ui';
import { DeleteAccountCard } from './delete-account-card';

export function SettingsView() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, setError, formState } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordValues) => {
    try {
      const message = await changePassword({ currentPassword, newPassword });
      toast.success(message);
      reset();
    } catch (error) {
      handleFormError(error, setError, ['currentPassword', 'newPassword']);
    }
  };

  return (
    <>
      <PageHeader title="Settings" />
      <Card className="mb-6">
        <CardHeader title="Account" />
        <CardBody className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-zinc-500">Name:</span> {user?.fullName}
          </p>
          <p>
            <span className="text-zinc-500">Email:</span> {user?.email}
          </p>
          <p className="capitalize">
            <span className="text-zinc-500">Account type:</span> {user?.role}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Change password" description="You’ll stay logged in here; other devices will be signed out." />
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4" noValidate>
            <FormField label="Current password" htmlFor="currentPassword" error={errors.currentPassword?.message}>
              <Input id="currentPassword" type="password" autoComplete="current-password" invalid={!!errors.currentPassword} {...register('currentPassword')} />
            </FormField>
            <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
              <Input id="newPassword" type="password" autoComplete="new-password" invalid={!!errors.newPassword} {...register('newPassword')} />
            </FormField>
            <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
              <Input id="confirmPassword" type="password" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
            </FormField>
            <Button type="submit" loading={isSubmitting}>
              Update password
            </Button>
          </form>
        </CardBody>
      </Card>
      <DeleteAccountCard />
    </>
  );
}
