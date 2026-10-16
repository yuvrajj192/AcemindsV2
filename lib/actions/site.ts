"use server";

import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
}

function text(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

/**
 * Google Maps "Embed a map" copies an <iframe> snippet, not a bare URL.
 * Accept either: extract src from HTML, decode &amp; entities, keep plain URLs.
 */
function extractMapEmbedUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  const src = s.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? s;
  return src.replace(/&amp;/g, "&").slice(0, 2000);
}

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveSiteSettings(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();

    const name = text(fd, "name").slice(0, 120);
    const tagline = text(fd, "tagline").slice(0, 160);
    const initiative = text(fd, "initiative").slice(0, 160);
    const domain = text(fd, "domain").slice(0, 120);
    const phone = text(fd, "phone").slice(0, 40);
    const phoneRaw = (text(fd, "phoneRaw").replace(/[^\d+]/g, "") || phone.replace(/[^\d+]/g, "")).slice(0, 20);
    const whatsapp = text(fd, "whatsapp").replace(/\D/g, "").slice(0, 20);
    const email = text(fd, "email").slice(0, 200);
    const address = text(fd, "address").slice(0, 400);
    const hours = text(fd, "hours").slice(0, 160);
    const mapEmbed = extractMapEmbedUrl(text(fd, "mapEmbed"));
    const youtube = text(fd, "youtube").slice(0, 300);
    const instagram = text(fd, "instagram").slice(0, 300);
    const facebook = text(fd, "facebook").slice(0, 300);
    const brochure = text(fd, "brochure").slice(0, 300);
    const founded = Number(fd.get("founded") || 0);

    if (!name || !tagline) return { ok: false, error: "Name and tagline are required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
    if (!/^\+?\d{10,15}$/.test(phoneRaw)) return { ok: false, error: "Phone (raw) must be 10–15 digits, optionally with +." };
    if (whatsapp && !/^\d{10,15}$/.test(whatsapp)) return { ok: false, error: "WhatsApp must be 10–15 digits with country code (e.g. 919000000000)." };
    if (!Number.isInteger(founded) || founded < 1950 || founded > 2100) return { ok: false, error: "Founded must be a year between 1950 and 2100." };

    await db
      .update(schema.siteSettings)
      .set({ name, tagline, initiative, domain, phone, phoneRaw, whatsapp, email, address, hours, mapEmbed, youtube, instagram, facebook, brochure, founded })
      .where(eq(schema.siteSettings.id, "main"));

    updateTag("site");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admissions");
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}
