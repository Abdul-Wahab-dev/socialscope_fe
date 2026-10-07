import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccess } from '@/components/dashboard/checkout-status';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Payment' };

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CheckoutSuccess />
    </Suspense>
  );
}
