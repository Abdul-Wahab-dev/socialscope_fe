import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import type { ApiSuccess } from '@/types/api';
import type { CheckoutResult, Payment } from '@/types/payment';

export type CheckoutPayload = { purpose: 'creator_registration' } | { purpose: 'search_credits'; packageId: string };

export async function createCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  try {
    const { data } = await apiClient.post<ApiSuccess<CheckoutResult>>('/payments/checkout', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not start checkout');
  }
}

export async function getPayments(): Promise<Payment[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<Payment[]>>('/payments');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load payments');
  }
}

export async function getPayment(id: string): Promise<Payment> {
  try {
    const { data } = await apiClient.get<ApiSuccess<Payment>>(`/payments/${id}`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load payment');
  }
}

/** Dev/test mode only (backend without Stripe keys). */
export async function confirmMockPayment(id: string): Promise<Payment> {
  try {
    const { data } = await apiClient.post<ApiSuccess<Payment>>(`/payments/${id}/mock-confirm`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not confirm test payment');
  }
}
