import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError, apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

export const ACCESS_COOKIE = "cc_access_token";
export const REFRESH_COOKIE = "cc_refresh_token";

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await apiFetch<User>("/api/v1/auth/me", { token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** Call at the top of any admin server component/layout — redirects to
 * /login if there's no session, or back home if logged in but not an admin. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");
  return user;
}
