"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError, apiFetch } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";
import type { User } from "@/lib/types";

interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const ACCESS_TOKEN_MAX_AGE = 60 * 30; // matches backend ACCESS_TOKEN_EXPIRE_MINUTES default
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // matches backend REFRESH_TOKEN_EXPIRE_DAYS default

async function setSessionAndRedirect(tokens: TokenPair): Promise<never> {
  const store = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  const shared = { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" };

  store.set(ACCESS_COOKIE, tokens.access_token, { ...shared, maxAge: ACCESS_TOKEN_MAX_AGE });
  store.set(REFRESH_COOKIE, tokens.refresh_token, { ...shared, maxAge: REFRESH_TOKEN_MAX_AGE });

  const me = await apiFetch<User>("/api/v1/auth/me", { token: tokens.access_token });
  redirect(me.role === "admin" ? "/admin" : "/");
}

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  let tokens: TokenPair;
  try {
    tokens = await apiFetch<TokenPair>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }

  return await setSessionAndRedirect(tokens);
}

export async function register(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { status: "error", message: "Please fill in every field." };
  }
  if (password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }

  let tokens: TokenPair;
  try {
    tokens = await apiFetch<TokenPair>("/api/v1/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }

  return await setSessionAndRedirect(tokens);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  redirect("/login");
}
