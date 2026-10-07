'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { handleFormError } from '@/lib/form-errors';
import { deleteAccount } from '@/services/auth.service';
import { Button, Card, CardBody, CardHeader, Dialog, FormField, Input } from '@/components/ui';

const schema = z.object({
  password: z.string().min(1, 'Enter your password'),
  confirm: z.literal('DELETE', 'Type DELETE in capital letters'),
});
type Values = z.input<typeof schema>;

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setError, reset, formState } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' as 'DELETE' } });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (v: Values) => {
    try {
      const code = await deleteAccount({ password: v.password, confirm: 'DELETE' });
      toast.success('Your account has been deleted');
      // Full navigation (not client routing) so the dashboard's auth guard can't race us to /login
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/data-deletion?code=${encodeURIComponent(code)}`);
    } catch (e) {
      handleFormError(e, setError, ['password', 'confirm']);
    }
  };

  return (
    <Card className="mt-6 ring-red-200">
      <CardHeader title="Delete account" description="Permanently delete your account and all associated data. This can’t be undone." icon={<Trash2 />} />
      <CardBody className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">Removes your profile, connected social accounts, statistics, rates, portfolio, collaboration requests and messages immediately.</p>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      </CardBody>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Delete your account?"
        description="This permanently erases your data. Active collaborations will be removed for the other party too."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Password" htmlFor="del-password" error={errors.password?.message}>
            <Input id="del-password" type="password" autoComplete="current-password" invalid={!!errors.password} {...register('password')} />
          </FormField>
          <FormField label="Type DELETE to confirm" htmlFor="del-confirm" error={errors.confirm?.message}>
            <Input id="del-confirm" autoComplete="off" invalid={!!errors.confirm} {...register('confirm')} />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={isSubmitting}>
              Permanently delete
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
