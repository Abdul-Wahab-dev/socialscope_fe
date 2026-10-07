'use client';

import { useApiQuery } from '@/lib/query';
import { CreditCard } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { useCheckout } from '@/hooks/use-checkout';
import { usePublicConfig } from '@/hooks/use-meta';
import { formatDate, formatMoney } from '@/lib/utils';
import { getPayments } from '@/services/payment.service';
import { getSearchQuota } from '@/services/search.service';
import type { PaymentStatus } from '@/types/payment';
import { Alert, Badge, Button, Card, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton, type BadgeTone } from '@/components/ui';

const statusTone: Record<PaymentStatus, BadgeTone> = { pending: 'warning', succeeded: 'success', failed: 'danger', cancelled: 'neutral' };

export function BillingView() {
  const config = usePublicConfig();
  const quota = useApiQuery({ queryKey: queryKeys.search.quota, queryFn: getSearchQuota });
  const payments = useApiQuery({ queryKey: queryKeys.payments.list, queryFn: getPayments });
  const checkout = useCheckout();
  const credits = quota.data?.type === 'user' ? quota.data.credits : 0;

  return (
    <>
      <PageHeader title="Billing" description={`You get ${config.data?.weeklyFreeSearchLimit ?? 15} free searches every week. Search packs never expire.`} />
      {config.data?.paymentsMode === 'mock' && (
        <Alert tone="info" className="mb-4" title="Test mode">
          Stripe isn’t configured, so checkout uses a simulated payment page.
        </Alert>
      )}

      <p className="mb-3 text-sm text-zinc-600">
        Current balance: <strong>{credits}</strong> search credits
      </p>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {config.isPending
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)
          : config.data?.searchCreditPackages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col p-5">
                <p className="text-sm font-medium text-zinc-500">{pkg.name}</p>
                <p className="mt-1 text-3xl font-semibold">{formatMoney(pkg.priceCents, config.data?.currency)}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {pkg.credits} searches · {formatMoney(Math.round(pkg.priceCents / pkg.credits), config.data?.currency)} each
                </p>
                <Button
                  className="mt-4"
                  loading={checkout.isPending && checkout.variables?.purpose === 'search_credits' && checkout.variables.packageId === pkg.id}
                  disabled={checkout.isPending}
                  onClick={() => checkout.mutate({ purpose: 'search_credits', packageId: pkg.id })}
                >
                  Buy {pkg.name}
                </Button>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader title="Payment history" />
        {payments.isPending ? (
          <Skeleton className="m-5 h-24" />
        ) : payments.isError ? (
          <div className="p-5">
            <ErrorState message={payments.error.message} onRetry={() => payments.refetch()} />
          </div>
        ) : payments.data.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<CreditCard className="h-8 w-8" />} title="No payments yet" />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {payments.data.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                <div className="flex-1">
                  <p className="font-medium">{p.purpose === 'search_credits' ? `${p.credits} search credits` : 'Creator listing'}</p>
                  <p className="text-xs text-zinc-500">{formatDate(p.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <span className="tabular-nums">{formatMoney(p.amountCents, p.currency)}</span>
                <Badge tone={statusTone[p.status]} className="capitalize">
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
