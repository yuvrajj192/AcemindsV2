import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ace_admin_session";
const SESSION_DAYS = 7;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
};

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or too short (need ≥32 chars). Add it to .env.local / Vercel env vars.");
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: Omit<SessionUser, "id"> & { sub: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function decrypt(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      name: String(payload.name ?? ""),
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const token = await encrypt({ sub: user.id, email: user.email, name: user.name, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Verify the session cookie (no DB — safe for proxy + layouts). */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}
