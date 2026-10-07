import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Welcome back</h1>
      <p className="mt-2 mb-8 text-[15px] text-zinc-500">Log in to continue to your dashboard.</p>
      <Suspense fallback={<Spinner />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
