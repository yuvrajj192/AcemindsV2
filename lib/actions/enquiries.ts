"use server";

import { revalidatePath, updateTag } from "next/cache";
import { after } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";

export type EnquiryResult = { ok: true } | { ok: false; error: string };

const SOURCES = new Set(["site", "contact", "counselling", "modal", "brochure"]);
const CLASSES = new Set(["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper"]);

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
}

function t(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

/** Public endpoint — called by EnquiryForm (contact / admissions / modal). */
export async function submitEnquiry(fd: FormData): Promise<EnquiryResult> {
  try {
    if (t(fd, "website")) return { ok: true }; // honeypot — pretend success, store nothing

    const name = t(fd, "name").slice(0, 120);
    const phone = t(fd, "phone").replace(/\D/g, "");
    const studentClass = t(fd, "class");
    const email = t(fd, "email").slice(0, 200);
    if (!name) return { ok: false, error: "Please enter the student's name." };
    if (!/^[6-9]\d{9}$/.test(phone)) return { ok: false, error: "Enter a valid 10-digit mobile number." };
    if (!CLASSES.has(studentClass)) return { ok: false, error: "Please select the class." };
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };

    const raw = t(fd, "source").toLowerCase();
    const course = t(fd, "course").slice(0, 160) || null;
    const message = t(fd, "message").slice(0, 2000) || null;
    const source = SOURCES.has(raw) ? raw : "site";
    const [row] = await db
      .insert(schema.enquiries)
      .values({ name, phone, studentClass, course, email: email || null, message, source })
      .returning({ id: schema.enquiries.id });

    updateTag("enquiries");
    revalidatePath("/admin/enquiries");
    after(() =>
      sendEnquiryAlert({ id: row.id, name, phone, studentClass, email, course, message, source })
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not send your enquiry — please try again." };
  }
}

/** Staff-only: change inbox status from the detail page. */
export async function setEnquiryStatus(fd: FormData): Promise<void> {
  await requireStaff();
  const id = t(fd, "id");
  const status = t(fd, "status");
  if (!id || (status !== "new" && status !== "read" && status !== "replied")) return;
  await db.update(schema.enquiries).set({ status }).where(eq(schema.enquiries.id, id));
  updateTag("enquiries");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function deleteEnquiry(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.enquiries).where(eq(schema.enquiries.id, id));
  updateTag("enquiries");
  revalidatePath("/admin/enquiries");
}

/* ---------- email alert (EmailJS REST — fire-and-forget, never blocks the submit) ---------- */

async function sendEnquiryAlert(e: {
  id: string;
  name: string;
  phone: string;
  studentClass: string;
  email: string;
  course: string | null;
  message: string | null;
  source: string;
}) {
  try {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) return; // not configured — silently skip

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aceminds.in";
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined,
        template_params: {
          to_email: process.env.ADMIN_ALERT_EMAIL,
          subject: `New enquiry · ${e.name} (${e.studentClass})`,
          reply_to: e.email || "",
          name: e.name,
          phone: e.phone,
          student_class: e.studentClass,
          email: e.email || "—",
          course: e.course || "—",
          source: e.source,
          message: e.message || "—",
          admin_url: `${site}/admin/enquiries/${e.id}`,
        },
      }),
      // never let a slow EmailJS call hold up the response
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[enquiry-alert]", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("[enquiry-alert]", err instanceof Error ? err.message : "send failed");
  }
}
