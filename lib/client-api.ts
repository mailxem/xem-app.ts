import { useSession } from "next-auth/react";

/**
 * Simple client-side helper to call the backend directly with the
 * logged-in user's bearer token.
 */
export function useClientApi() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const callApi = async <T = unknown>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (!token) {
      throw new Error("Not authenticated");
    }

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    if (
      options.body &&
      !headers.has("Content-Type") &&
      !(options.body instanceof FormData)
    ) {
      headers.set("Content-Type", "application/json");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/${path}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed with status ${res.status}`);
    }

    // Attempt to parse JSON, fallback to text
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  };

  return { callApi };
}

