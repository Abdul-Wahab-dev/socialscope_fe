import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import type { ApiSuccess } from '@/types/api';
import type { BrandProfile, SavedCreator } from '@/types/brand';
import type { BrandProfileValues } from '@/validations/brand.schema';

export async function getMyBrandProfile(): Promise<BrandProfile> {
  try {
    const { data } = await apiClient.get<ApiSuccess<BrandProfile>>('/brands/me');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load company profile');
  }
}

export async function updateMyBrandProfile(payload: Partial<BrandProfileValues>): Promise<BrandProfile> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<BrandProfile>>('/brands/me', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not update company profile');
  }
}

export async function getSavedCreators(): Promise<SavedCreator[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<SavedCreator[]>>('/brands/me/saved');
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load saved creators');
  }
}

export async function saveCreator(creatorProfileId: string, note?: string): Promise<void> {
  try {
    await apiClient.post('/brands/me/saved', { creatorProfileId, note });
  } catch (error) {
    throw toAppError(error, 'Could not save creator');
  }
}

export async function unsaveCreator(creatorProfileId: string): Promise<void> {
  try {
    await apiClient.delete(`/brands/me/saved/${creatorProfileId}`);
  } catch (error) {
    throw toAppError(error, 'Could not remove creator');
  }
}
