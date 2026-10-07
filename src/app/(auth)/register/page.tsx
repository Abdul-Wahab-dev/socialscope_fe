import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/register-form';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Create your account</h1>
      <p className="mt-2 mb-8 text-[15px] text-zinc-500">Join as a creator or as a brand looking for creators.</p>
      <Suspense fallback={<Spinner />}>
        <RegisterForm />
      </Suspense>
    </>
  );
}
