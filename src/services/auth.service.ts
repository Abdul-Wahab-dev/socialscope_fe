import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import type { ApiSuccess } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { ChangePasswordValues, LoginValues, RegisterPayload } from '@/validations/auth.schema';

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/register', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not create your account');
  }
}

export async function login(payload: LoginValues): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not log you in');
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    throw toAppError(error);
  }
}

/** Returns null when the visitor is not logged in (instead of throwing). */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<ApiSuccess<User>>('/auth/me');
    return data.data;
  } catch (error) {
    const appError = toAppError(error);
    if (appError.status === 401) return null;
    throw appError;
  }
}

export async function changePassword(payload: Omit<ChangePasswordValues, 'confirmPassword'>): Promise<string> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<null>>('/auth/password', payload);
    return data.message ?? 'Password updated';
  } catch (error) {
    throw toAppError(error, 'Could not update password');
  }
}

/** Permanently deletes the signed-in account. Returns the deletion confirmation code. */
export async function deleteAccount(payload: { password: string; confirm: 'DELETE' }): Promise<string> {
  try {
    const { data } = await apiClient.delete<ApiSuccess<{ confirmationCode: string }>>('/auth/me', { data: payload });
    return data.data.confirmationCode;
  } catch (error) {
    throw toAppError(error, 'Could not delete your account');
  }
}
