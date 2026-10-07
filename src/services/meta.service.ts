import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import type { ApiSuccess } from '@/types/api';
import type { Category } from '@/types/creator';
import type { PublicConfig } from '@/types/payment';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<Category[]>>('/meta/categories');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load categories');
  }
}

export async function getPublicConfig(): Promise<PublicConfig> {
  try {
    const { data } = await apiClient.get<ApiSuccess<PublicConfig>>('/meta/config');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load configuration');
  }
}
