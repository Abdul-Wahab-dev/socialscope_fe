import { apiClient } from "@/lib/api-client";
import { toAppError } from "@/lib/api-error";
import type { ApiSuccess } from "@/types/api";
import type { SocialAccount, SocialPlatform } from "@/types/creator";

export async function getSocialAccounts(): Promise<SocialAccount[]> {
  try {
    const { data } =
      await apiClient.get<ApiSuccess<SocialAccount[]>>("/social/accounts");
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not load connected accounts");
  }
}

/** Returns the provider's OAuth consent URL; the caller redirects the browser to it. */
export async function getSocialConnectUrl(
  platform: SocialPlatform
): Promise<string> {
  try {
    const { data } = await apiClient.get<ApiSuccess<{ url: string }>>(
      `/social/${platform}/connect`
    );
    return data.data.url;
  } catch (error) {
    throw toAppError(error, `Could not start ${platform} connection`);
  }
}

export async function syncSocialAccount(id: string): Promise<SocialAccount> {
  try {
    const { data } = await apiClient.post<ApiSuccess<SocialAccount>>(
      `/social/accounts/${id}/sync`
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not refresh stats");
  }
}

export interface SelfReportedStatsPayload {
  profileUrl: string;
  followers: number;
  postsCount?: number;
  avgViews?: number;
  avgLikes: number;
  avgComments: number;
}

/** Saves creator-entered stats for a self-reported account (Facebook profile). */
export async function updateSelfReportedStats(
  id: string,
  payload: SelfReportedStatsPayload
): Promise<SocialAccount> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<SocialAccount>>(
      `/social/accounts/${id}/stats`,
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not save your stats");
  }
}

export async function disconnectSocialAccount(id: string): Promise<void> {
  try {
    await apiClient.delete(`/social/accounts/${id}`);
  } catch (error) {
    throw toAppError(error, "Could not disconnect account");
  }
}

export interface DeletionStatus {
  confirmationCode: string;
  status: "received" | "completed" | "not_found";
  source: string;
  requestedAt: string;
  completedAt: string | null;
}

/** Public lookup for a data-deletion confirmation code (e.g. from Meta's deletion callback). */
export async function getDeletionStatus(code: string): Promise<DeletionStatus> {
  try {
    const { data } = await apiClient.get<ApiSuccess<DeletionStatus>>(
      `/social/data-deletion/${encodeURIComponent(code)}`
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not look up this request");
  }
}
