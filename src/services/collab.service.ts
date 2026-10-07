import { apiClient } from '@/lib/api-client';
import { toAppError } from '@/lib/api-error';
import { cleanParams } from '@/lib/utils';
import type { ApiSuccess, Paginated, PaginationMeta } from '@/types/api';
import type { CollabRequest, CollabStatus, Message } from '@/types/collab';
import type { CollabRequestValues, RespondCollabValues } from '@/validations/collab.schema';

export async function getCollabs(params: { status?: CollabStatus; page?: number; limit?: number } = {}): Promise<Paginated<CollabRequest>> {
  try {
    const { data } = await apiClient.get<ApiSuccess<CollabRequest[], PaginationMeta>>('/collabs', { params: cleanParams(params) });
    return { items: data.data, meta: data.meta! };
  } catch (error) {
    throw toAppError(error, 'Could not load collaborations');
  }
}

export async function getCollab(id: string): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.get<ApiSuccess<CollabRequest>>(`/collabs/${id}`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load collaboration');
  }
}

export async function createCollab(payload: CollabRequestValues & { creatorProfileId: string }): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.post<ApiSuccess<CollabRequest>>('/collabs', payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not send request');
  }
}

export async function respondToCollab(id: string, payload: RespondCollabValues): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<CollabRequest>>(`/collabs/${id}/respond`, payload);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not send your response');
  }
}

export async function respondToCounter(id: string, action: 'accept' | 'decline'): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<CollabRequest>>(`/collabs/${id}/counter-response`, { action });
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not respond to the counter offer');
  }
}

export async function cancelCollab(id: string): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<CollabRequest>>(`/collabs/${id}/cancel`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not cancel request');
  }
}

export async function completeCollab(id: string): Promise<CollabRequest> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<CollabRequest>>(`/collabs/${id}/complete`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not mark as completed');
  }
}

export async function getCollabMessages(id: string): Promise<Message[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<Message[]>>(`/collabs/${id}/messages`);
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Could not load messages');
  }
}

export async function sendCollabMessage(id: string, body: string): Promise<Message> {
  try {
    const { data } = await apiClient.post<ApiSuccess<Message>>(`/collabs/${id}/messages`, { body });
    return data.data;
  } catch (error) {
    throw toAppError(error, 'Message not sent');
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const { data } = await apiClient.get<ApiSuccess<{ unread: number }>>('/collabs/unread-count');
    return data.data.unread;
  } catch (error) {
    throw toAppError(error);
  }
}
