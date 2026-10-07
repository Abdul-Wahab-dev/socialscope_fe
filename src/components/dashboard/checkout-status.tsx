'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { CheckCircle2, Clock, FlaskConical, XCircle } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { formatMoney } from '@/lib/utils';
import { confirmMockPayment, getPayment } from '@/services/payment.service';
import { Button, ErrorState, Spinner, buttonClasses } from '@/components/ui';

function useInvalidateAfterPayment(done: boolean) {
  const queryCache = useQueryCache();
  useEffect(() => {
    if (!done) return;
    for (const key of [queryKeys.me, queryKeys.creator.me, queryKeys.search.quota, queryKeys.payments.list]) queryCache.invalidate(key);
  }, [done, queryCache]);
}

const nextStep = (purpose?: string) => (purpose === 'creator_registration' ? routes.creator.root : routes.brand.billing);

/** Stripe redirects here; the webhook may land a moment later, so poll until the payment settles. */
export function CheckoutSuccess() {
  const paymentId = useSearchParams().get('paymentId') ?? '';
  const payment = useApiQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (data) => (data?.status === 'pending' ? 2000 : false),
  });
  useInvalidateAfterPayment(payment.data?.status === 'succeeded');

  if (!paymentId) return <ErrorState message="Missing payment reference." />;
  if (payment.isPending) return <Spinner />;
  if (payment.isError) return <ErrorState message={payment.error.message} onRetry={() => payment.refetch()} />;

  const p = payment.data;
  if (p.status === 'pending')
    return (
      <>
        <Clock className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-3 text-lg font-semibold">Confirming your payment…</h1>
        <p className="mt-1 text-sm text-zinc-500">This usually takes a few seconds.</p>
      </>
    );
  if (p.status !== 'succeeded')
    return (
      <>
        <XCircle className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-3 text-lg font-semibold">Payment {p.status}</h1>
        <Link href={nextStep(p.purpose)} className={buttonClasses('primary', 'md', 'mt-5')}>
          Go back
        </Link>
      </>
    );
  return (
    <>
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
      <h1 className="mt-3 text-lg font-semibold">Payment successful</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {p.purpose === 'creator_registration' ? 'Your creator profile is now live and searchable.' : `${p.credits} search credits were added to your account.`}
      </p>
      <Link href={nextStep(p.purpose)} className={buttonClasses('primary', 'md', 'mt-5')}>
        Continue
      </Link>
    </>
  );
}

export function CheckoutCancelled() {
  const { user } = useAuth();
  return (
    <>
      <XCircle className="mx-auto h-10 w-10 text-zinc-400" />
      <h1 className="mt-3 text-lg font-semibold">Checkout cancelled</h1>
      <p className="mt-1 text-sm text-zinc-500">No payment was taken.</p>
      <Link href={user?.role === 'brand' ? routes.brand.billing : routes.creator.root} className={buttonClasses('primary', 'md', 'mt-5')}>
        Back to dashboard
      </Link>
    </>
  );
}

/** Stand-in for Stripe Checkout while STRIPE_SECRET_KEY is not configured. */
export function MockCheckout() {
  const paymentId = useSearchParams().get('paymentId') ?? '';
  const payment = useApiQuery({ queryKey: queryKeys.payments.detail(paymentId), queryFn: () => getPayment(paymentId), enabled: Boolean(paymentId) });
  const confirm = useApiMutation({ mutationFn: () => confirmMockPayment(paymentId), onSuccess: () => payment.refetch() });
  useInvalidateAfterPayment(confirm.isSuccess);

  if (!paymentId) return <ErrorState message="Missing payment reference." />;
  if (payment.isPending) return <Spinner />;
  if (payment.isError) return <ErrorState message={payment.error.message} />;

  const p = payment.data;
  if (p.status === 'succeeded')
    return (
      <>
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
        <h1 className="mt-3 text-lg font-semibold">Test payment confirmed</h1>
        <Link href={nextStep(p.purpose)} className={buttonClasses('primary', 'md', 'mt-5')}>
          Continue
        </Link>
      </>
    );

  return (
    <>
      <FlaskConical className="mx-auto h-10 w-10 text-brand-600" />
      <h1 className="mt-3 text-lg font-semibold">Test checkout</h1>
      <p className="mt-1 text-sm text-zinc-500">Stripe isn’t configured on the API, so this page simulates a payment.</p>
      <p className="mt-4 text-2xl font-semibold">{formatMoney(p.amountCents, p.currency)}</p>
      <p className="text-sm text-zinc-600">{p.purpose === 'creator_registration' ? 'Creator listing fee' : `${p.credits} search credits`}</p>
      {confirm.isError && <p className="mt-3 text-sm text-red-600">{confirm.error?.message}</p>}
      <div className="mt-6 flex justify-center gap-2">
        <Link href={routes.checkout.cancelled} className={buttonClasses('secondary')}>
          Cancel
        </Link>
        <Button loading={confirm.isPending} onClick={() => confirm.mutate()}>
          Pay (test)
        </Button>
      </div>
    </>
  );
}
