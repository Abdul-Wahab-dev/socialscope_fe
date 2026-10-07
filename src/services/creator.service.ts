import { apiClient } from "@/lib/api-client";
import { toAppError } from "@/lib/api-error";
import type { ApiSuccess } from "@/types/api";
import type {
  CreatorInsights,
  CreatorProfile,
  PortfolioItem,
  RateCard,
} from "@/types/creator";
import type {
  CreatorProfileValues,
  PortfolioItemValues,
  RateCardValues,
} from "@/validations/creator.schema";

// ---------- Profile ----------
export async function getMyCreatorProfile(): Promise<CreatorProfile> {
  try {
    const { data } =
      await apiClient.get<ApiSuccess<CreatorProfile>>("/creators/me");
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not load your profile");
  }
}

export async function updateMyCreatorProfile(
  payload: Partial<CreatorProfileValues>
): Promise<CreatorProfile> {
  try {
    const { data } = await apiClient.post<ApiSuccess<CreatorProfile>>(
      "/creators/me",
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not update your profile");
  }
}

export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  try {
    const { data } = await apiClient.get<ApiSuccess<{ available: boolean }>>(
      "/creators/username-available",
      { params: { username } }
    );
    return data.data.available;
  } catch (error) {
    throw toAppError(error);
  }
}

export async function getCreatorInsights(): Promise<CreatorInsights> {
  try {
    const { data } = await apiClient.get<ApiSuccess<CreatorInsights>>(
      "/creators/me/insights"
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not load insights");
  }
}

// ---------- Rate cards ----------
export async function getRateCards(): Promise<RateCard[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<RateCard[]>>(
      "/creators/me/rate-cards"
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not load your rates");
  }
}

export async function createRateCard(
  payload: RateCardValues
): Promise<RateCard> {
  try {
    const { data } = await apiClient.post<ApiSuccess<RateCard>>(
      "/creators/me/rate-cards",
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not add rate");
  }
}

export async function updateRateCard(
  id: string,
  payload: Partial<RateCardValues>
): Promise<RateCard> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<RateCard>>(
      `/creators/me/rate-cards/${id}`,
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not update rate");
  }
}

export async function deleteRateCard(id: string): Promise<void> {
  try {
    await apiClient.delete(`/creators/me/rate-cards/${id}`);
  } catch (error) {
    throw toAppError(error, "Could not delete rate");
  }
}

// ---------- Portfolio ----------
export async function getPortfolio(): Promise<PortfolioItem[]> {
  try {
    const { data } = await apiClient.get<ApiSuccess<PortfolioItem[]>>(
      "/creators/me/portfolio"
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not load your portfolio");
  }
}

export async function createPortfolioItem(
  payload: PortfolioItemValues
): Promise<PortfolioItem> {
  try {
    const { data } = await apiClient.post<ApiSuccess<PortfolioItem>>(
      "/creators/me/portfolio",
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not add portfolio item");
  }
}

export async function updatePortfolioItem(
  id: string,
  payload: Partial<PortfolioItemValues>
): Promise<PortfolioItem> {
  try {
    const { data } = await apiClient.patch<ApiSuccess<PortfolioItem>>(
      `/creators/me/portfolio/${id}`,
      payload
    );
    return data.data;
  } catch (error) {
    throw toAppError(error, "Could not update portfolio item");
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  try {
    await apiClient.delete(`/creators/me/portfolio/${id}`);
  } catch (error) {
    throw toAppError(error, "Could not delete portfolio item");
  }
}
