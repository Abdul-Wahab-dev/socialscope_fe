import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialAccountsView } from '@/components/dashboard/social-accounts-view';
import { Spinner } from '@/components/ui';

export const metadata: Metadata = { title: 'Social accounts' };

export default function CreatorSocialsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SocialAccountsView />
    </Suspense>
  );
}
