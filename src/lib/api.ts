import { getAuthToken, clearSession } from "./auth";
import { getAdminAuthToken, clearAdminSession } from "../admin-portal/lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[API]",
      options.method || "GET",
      endpoint,
      token ? "WITH TOKEN" : "NO TOKEN"
    );
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
    clearAdminSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => ({
      message: "Request failed",
    }))) as { message?: string };
    throw new Error(error.message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export const merchantAPI = {
  get: <T = unknown>(endpoint: string) => {
    const token = getAuthToken();
    return fetchAPI<T>(endpoint, {}, token || undefined);
  },
  post: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  patch: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  put: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  delete: <T = unknown>(endpoint: string) => {
    const token = getAuthToken();
    return fetchAPI<T>(
      endpoint,
      {
        method: "DELETE",
      },
      token || undefined
    );
  },
};

export const partnerAPI = {
  get: <T = unknown>(endpoint: string) => {
    const token = getAuthToken();
    return fetchAPI<T>(endpoint, {}, token || undefined);
  },
  post: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  patch: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  put: (endpoint: string, body: unknown) => {
    const token = getAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
};

export const adminAPI = {
  get: <T = unknown>(endpoint: string) => {
    const token = getAdminAuthToken();
    return fetchAPI<T>(endpoint, {}, token || undefined);
  },
  post: (endpoint: string, body?: unknown) => {
    const token = getAdminAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      token || undefined
    );
  },
  patch: (endpoint: string, body: unknown) => {
    const token = getAdminAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  put: (endpoint: string, body: unknown) => {
    const token = getAdminAuthToken();
    return fetchAPI(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      token || undefined
    );
  },
  delete: <T = unknown>(endpoint: string) => {
    const token = getAdminAuthToken();
    return fetchAPI<T>(
      endpoint,
      {
        method: "DELETE",
      },
      token || undefined
    );
  },
};

/** Unwrap `{ data: T }` or return value as-is */
export function unwrapData<T>(res: unknown): T {
  if (
    res !== null &&
    typeof res === "object" &&
    "data" in res &&
    (res as { data: unknown }).data !== undefined
  ) {
    return (res as { data: T }).data;
  }
  return res as T;
}

/** Unwrap list responses: array, `{ data: [] }`, or `{ requests: [] }` */
export function unwrapList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  if (res && typeof res === "object") {
    const obj = res as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.requests)) return obj.requests as T[];
    if (Array.isArray(obj.ingredients)) return obj.ingredients as T[];
    if (Array.isArray(obj.suppliers)) return obj.suppliers as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.menuItems)) return obj.menuItems as T[];
  }
  return [];
}

export { fetchAPI };
