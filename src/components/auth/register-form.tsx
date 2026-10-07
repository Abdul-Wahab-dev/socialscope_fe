'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Camera } from 'lucide-react';
import { dashboardHome, routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { handleFormError } from '@/lib/form-errors';
import { cn } from '@/lib/utils';
import { registerSchema, toRegisterPayload, type RegisterValues } from '@/validations/auth.schema';
import { Button, FormField, Input } from '@/components/ui';
import { safeNext } from './login-form';

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'brand' ? 'brand' : 'creator';

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole, fullName: '', email: '', password: '', confirmPassword: '', username: '', companyName: '', acceptTerms: false },
  });
  const role = useWatch({ control, name: 'role' });

  const onSubmit = async (values: RegisterValues) => {
    try {
      const user = await signUp(toRegisterPayload(values));
      router.replace(safeNext(searchParams.get('next')) ?? dashboardHome(user.role));
      router.refresh();
    } catch (error) {
      handleFormError(error, setError, ['email', 'password', 'fullName', 'username', 'companyName']);
    }
  };

  const roleOption = (value: 'creator' | 'brand', label: string, sub: string, Icon: typeof Camera) => (
    <button
      type="button"
      onClick={() => setValue('role', value, { shouldValidate: false })}
      aria-pressed={role === value}
      className={cn(
        'flex flex-1 flex-col items-start gap-1 rounded-2xl p-4 text-left transition-all',
        role === value ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-white shadow-soft ring-1 ring-zinc-200 hover:ring-zinc-300',
      )}
    >
      <span className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-xl', role === value ? 'bg-brand-600 text-white' : 'bg-zinc-100 text-zinc-600')}>
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-zinc-500">{sub}</span>
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex gap-3" role="group" aria-label="Account type">
        {roleOption('creator', 'I’m a creator', 'Get paid collabs', Camera)}
        {roleOption('brand', 'I’m a brand', 'Find creators', Building2)}
      </div>

      <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
        <Input id="fullName" autoComplete="name" invalid={!!errors.fullName} {...register('fullName')} />
      </FormField>

      {role === 'creator' ? (
        <FormField label="Username" htmlFor="username" error={errors.username?.message} hint="Your public link: /c/username">
          <Input id="username" autoComplete="username" placeholder="e.g. ali.eats" invalid={!!errors.username} {...register('username')} />
        </FormField>
      ) : (
        <FormField label="Company / brand name" htmlFor="companyName" error={errors.companyName?.message}>
          <Input id="companyName" autoComplete="organization" invalid={!!errors.companyName} {...register('companyName')} />
        </FormField>
      )}

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" invalid={!!errors.password} {...register('password')} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <Input id="confirmPassword" type="password" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
        </FormField>
      </div>
      <p className="text-xs text-zinc-500">At least 8 characters with an uppercase letter, a lowercase letter and a number.</p>

      <div>
        <label className="flex items-start gap-2 text-sm text-zinc-700">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-brand-600" {...register('acceptTerms')} />
          <span>
            I agree to the{' '}
            <Link href="/terms" target="_blank" className="font-medium text-brand-700 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" target="_blank" className="font-medium text-brand-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && <p className="mt-1 text-xs text-red-600">{errors.acceptTerms.message}</p>}
      </div>

      <Button type="submit" variant="dark" size="lg" className="w-full" loading={isSubmitting}>
        Create account
      </Button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href={routes.login} className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
