import { useMemo } from "react";
import { useSession } from "next-auth/react";

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = RequestInit & {
  query?: Record<string, QueryValue>;
};

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "") || "";

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(`${API_BASE_URL}/${cleanPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as unknown as T;
}

export function useApiClient() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const request = useMemo(() => {
    return async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      if (!token) {
        throw new Error("Not authenticated");
      }

      const { query, ...init } = options;
      const url = buildUrl(path, query);
      const headers = new Headers(init.headers);

      if (!headers.has("authorization")) {
        headers.set("authorization", `Bearer ${token}`);
      }

      if (!headers.has("content-type") && init.body) {
        headers.set("content-type", "application/json");
      }

      const response = await fetch(url, {
        ...init,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          errorBody || `Request failed with status ${response.status}`
        );
      }

      return parseResponse<T>(response);
    };
  }, [token]);

  return {
    request,
    token,
    isAuthenticated: Boolean(token),
  };
}

