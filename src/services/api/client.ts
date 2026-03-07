/**
 * API Client
 * Wrapper around fetch with error handling and token management.
 *
 * Includes a 401 interceptor that automatically refreshes tokens
 * when the access token expires, then retries the original request.
 */

import { apiConfig } from "../config/api.config";

interface ApiError {
  message: string;
  code: string;
  status: number;
}

/** Endpoints that should NOT trigger auto-refresh on 401 */
const AUTH_ENDPOINTS = ["/auth/refresh", "/auth/login", "/auth/register"];

class ApiClient {
  private baseUrl: string;
  /** Lock to deduplicate concurrent refresh attempts */
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { _retried?: boolean } = {},
  ): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    const { _retried, ...fetchOptions } = options;

    const response = await fetch(url, {
      ...fetchOptions,
      credentials: "include", // Include cookies for auth
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      // 401 on a non-auth endpoint → try refreshing tokens, then retry once
      const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => endpoint.includes(path));
      if (response.status === 401 && !isAuthEndpoint && !_retried) {
        const refreshed = await this.tryRefresh();
        if (refreshed) {
          return this.request<T>(endpoint, { ...options, _retried: true });
        }
        // Refresh failed — force full logout
        await this.forceLogout();
      }

      const error: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        status: response.status,
      }));
      throw error;
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Attempt to refresh tokens via the refresh endpoint.
   * Uses a lock so concurrent 401s only fire one refresh request.
   */
  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const res = await fetch(`${this.baseUrl}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /** Clear auth state and redirect to login */
  private async forceLogout(): Promise<void> {
    // Dynamic import to avoid circular dependency
    const { useAuthStore } = await import("@/stores/auth.store");
    useAuthStore.getState().logout();
    window.location.href = "/admin/login";
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(apiConfig.baseUrl);
