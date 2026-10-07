import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MockCheckout } from '@/components/dashboard/checkout-status';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Test checkout' };

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <MockCheckout />
    </Suspense>
  );
}
