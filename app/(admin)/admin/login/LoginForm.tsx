"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending || ok) return;
    setPending(true);
    setError(null);
    try {
      /* Manual dispatch instead of useActionState: if the flight response is ever
         lost (redirect, stale action id, network), the promise rejects and we
         recover — pending can never hang on "Signing in…". */
      const res = await login(undefined, new FormData(e.currentTarget));
      if (res?.ok) {
        setOk(true);
        /* Session cookie is already set — full page load into the panel. */
        window.location.assign("/admin");
      } else {
        setError(res?.error ?? "Sign-in failed. Please try again.");
        setPending(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="alogin__form">
      {error ? (
        <p className="alogin__error" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
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
      <button className="alogin__btn" type="submit" disabled={pending || ok}>
        {ok ? "Signed in…" : pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
