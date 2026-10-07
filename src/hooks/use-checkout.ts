'use client';

import { useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { queryKeys } from '@/constants/query-keys';
import { createCheckout, type CheckoutPayload } from '@/services/payment.service';

/** Starts a checkout and redirects to Stripe (or the mock page); handles free activations inline. */
export function useCheckout() {
  const queryCache = useQueryCache();
  return useApiMutation({
    mutationFn: (payload: CheckoutPayload) => createCheckout(payload),
    onSuccess: async (result) => {
      if (result.activated) {
        toast.success('Your profile is now live! 🎉');
        await Promise.all([
          queryCache.invalidate(queryKeys.creator.me),
          queryCache.invalidate(queryKeys.me),
        ]);
        return;
      }
      if (result.checkoutUrl) window.location.assign(result.checkoutUrl);
    },
    onError: (error) => toast.error(error.message),
  });
}
