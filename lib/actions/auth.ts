"use server";

import { createSession, deleteSession } from "@/lib/session";
import { findUserByEmail, verifyPassword } from "@/lib/auth";
import type { SessionUser } from "@/lib/session";

export type LoginState = { error?: string; ok?: boolean } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const user = await findUserByEmail(email);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    return { error: "Invalid email or password." };
  }

  const session: SessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  await createSession(session);
  /* No redirect() here — the client does a full page navigation instead.
     redirect() inside useActionState can leave `pending` stuck even when
     the session cookie was set successfully. */
  return { ok: true };
}

export async function logout() {
  await deleteSession();
}
