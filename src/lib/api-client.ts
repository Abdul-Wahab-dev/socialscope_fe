import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

/**
 * Browser API client. Auth lives in httpOnly cookies set by the API, so we only need
 * `withCredentials`. When the access token expires the API answers 401 TOKEN_EXPIRED:
 * we refresh once (shared across concurrent requests) and replay the original request.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 20_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const hasSessionHint = () =>
  typeof document !== "undefined" &&
  document.cookie.split("; ").some((c) => c.startsWith("ss_session="));

let refreshPromise: Promise<void> | null = null;
export const AUTH_EXPIRED_EVENT = "auth:expired";

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${env.apiUrl}/auth/refresh`, null, {
        withCredentials: true,
        timeout: 15_000,
      })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { code?: string } }>) => {
    const original = error.config as RetriableConfig | undefined;
    const code = error.response?.data?.error?.code;

    // Refresh when the JWT expired, or when the access cookie is gone but a session hint remains
    const shouldRefresh =
      code === "TOKEN_EXPIRED" || (code === "UNAUTHORIZED" && hasSessionHint());
    const isAuthCall =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register");
    if (
      error.response?.status === 401 &&
      shouldRefresh &&
      !isAuthCall &&
      original &&
      !original._retry
    ) {
      original._retry = true;
      try {
        await refreshSession();
        return apiClient(original);
      } catch (refreshError) {
        if (typeof window !== "undefined")
          window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
