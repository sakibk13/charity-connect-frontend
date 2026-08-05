import { env } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Bearer token for admin-only endpoints — read server-side from the
   * httpOnly session cookie (see lib/auth.ts) and passed in explicitly,
   * since client components can't read httpOnly cookies themselves. */
  token?: string;
};

/**
 * Thin fetch wrapper around charity-connect-api. Always goes through this
 * (never call fetch() to the API directly) so auth headers, JSON handling,
 * and error shape stay consistent across the app.
 */
export async function apiFetch<T>(
  path: string,
  { body, headers, token, ...init }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail?: unknown }).detail)
        : undefined) ?? `Request to ${path} failed with ${res.status}`;
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}
