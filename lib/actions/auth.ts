"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { findUserByEmail, verifyPassword } from "@/lib/auth";
import type { SessionUser } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

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
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
