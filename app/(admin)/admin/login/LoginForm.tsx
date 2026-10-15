"use client";

import { useEffect, useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

  useEffect(() => {
    if (state?.ok) {
      /* Full page load — cookie is already set; avoids stuck `pending`
         from client-side RSC navigation after the action resolves. */
      window.location.assign("/admin");
    }
  }, [state]);

  return (
    <form action={formAction} className="alogin__form">
      {state?.error ? (
        <p className="alogin__error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="alogin__ok" role="status">
          Signed in — opening panel…
        </p>
      ) : null}
      <label className="alogin__field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" placeholder="you@aceminds.in" required autoFocus />
      </label>
      <label className="alogin__field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
      </label>
      <button className="alogin__btn" type="submit" disabled={pending || state?.ok}>
        {state?.ok ? "Signed in…" : pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
