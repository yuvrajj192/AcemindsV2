import "server-only";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { getSession, type SessionUser } from "@/lib/session";

export type { SessionUser };
export { createSession, deleteSession, getSession, SESSION_COOKIE } from "@/lib/session";

/** Session user, optionally re-fetched from DB (for up-to-date role/name). */
export async function getSessionUser(refresh = false): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) return null;
  if (!refresh) return session;
  const row = await db.query.users.findFirst({ where: eq(schema.users.id, session.id) });
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(schema.users.email, email.toLowerCase().trim()) });
}
