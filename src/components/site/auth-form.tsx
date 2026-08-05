"use client";

import { useActionState } from "react";

import { login } from "@/lib/auth-actions";
import { initialActionState } from "@/lib/action-state";

export function AuthForm() {
  const [loginState, loginAction, loginPending] = useActionState(login, initialActionState);

  return (
    <form action={loginAction}>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="login-email">Email Address</label>
        <input id="login-email" name="email" type="email" required className="pt-form-input" placeholder="e.g. donor@example.com" />
      </div>
      <div className="pt-form-group">
        <label className="pt-form-label" htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" required className="pt-form-input" placeholder="••••••••" />
      </div>
      {loginState.status === "error" && (
        <p style={{ color: "var(--pt-danger)", fontSize: "0.85rem", marginBottom: 16 }}>{loginState.message}</p>
      )}
      <button type="submit" disabled={loginPending} className="pt-btn pt-btn-primary pt-btn-full">
        {loginPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
