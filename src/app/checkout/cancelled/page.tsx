import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutCancelled } from '@/components/dashboard/checkout-status';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Checkout cancelled' };

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CheckoutCancelled />
    </Suspense>
  );
}
