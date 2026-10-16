"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitEnquiry } from "@/lib/actions/enquiries";
import type { Course } from "@/lib/types";
import { Icon } from "./Icons";

type Props = { id: string; full?: boolean; cta?: string; source?: string; defaultCourse?: string; courses: Course[] };

export function EnquiryForm({ id, full, cta = "Book my free demo class", source = "site", defaultCourse = "", courses }: Props) {
  const [sent, setSent] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const bad: Record<string, boolean> = {};
    let first: HTMLElement | null = null;
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (!el.name || !el.checkValidity) continue;
      if (!el.checkValidity()) {
        bad[el.name] = true;
        first ??= el;
      }
    }
    setInvalid(bad);
    if (first) { first.focus(); return; }

    const fd = new FormData(form);
    fd.set("source", source);
    setErr("");
    startTransition(async () => {
      const res = await submitEnquiry(fd);
      if (res.ok) setSent(true);
      else setErr(res.error);
    });
  };

  const clear = (name: string) => invalid[name] && setInvalid((v) => ({ ...v, [name]: false }));
  const f = (name: string) => `field${invalid[name] ? " invalid" : ""}`;

  if (sent) {
    return (
      <div className="form-success" role="status" style={{ display: "block" }}>
        <div className="tick"><Icon.check /></div>
        <h3>Thank you! We&apos;ve got it.</h3>
        <p style={{ color: "var(--ink-soft)" }}>Our counsellor will call you shortly to confirm your demo slot.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" noValidate onSubmit={onSubmit}>
      <div className="form-grid">
        <div className={f("name")}>
          <label htmlFor={`${id}-name`}>Student name *</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required onInput={() => clear("name")} />
          <span className="err">Please enter the student&apos;s name</span>
        </div>
        <div className={f("phone")}>
          <label htmlFor={`${id}-phone`}>Mobile number *</label>
          <input
            id={`${id}-phone`} name="phone" type="tel" inputMode="numeric" autoComplete="tel" pattern="[6-9][0-9]{9}" maxLength={10} required
            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); clear("phone"); }}
          />
          <span className="err">Enter a valid 10-digit mobile number</span>
        </div>
        <div className={f("class")}>
          <label htmlFor={`${id}-class`}>Current class *</label>
          <select id={`${id}-class`} name="class" required defaultValue="" onChange={() => clear("class")}>
            <option value="">Select class</option>
            {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="err">Please select a class</span>
        </div>
        <div className="field">
          <label htmlFor={`${id}-course`}>Interested in</label>
          <select id={`${id}-course`} name="course" defaultValue={defaultCourse}>
            <option value="">Choose a course</option>
            {courses.map((c) => <option key={c.title}>{c.title}</option>)}
          </select>
        </div>
        {full && (
          <>
            <div className={`${f("email")} full`}>
              <label htmlFor={`${id}-email`}>Email</label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" onInput={() => clear("email")} />
              <span className="err">Enter a valid email</span>
            </div>
            <div className="field full">
              <label htmlFor={`${id}-msg`}>Message</label>
              <textarea id={`${id}-msg`} name="message" placeholder="Tell us about the student's goals" />
            </div>
          </>
        )}
        <div className="full">
          {/* honeypot — bots fill it, humans never see it */}
          <div className="hp" aria-hidden="true">
            <label htmlFor={`${id}-hp`}>Leave this field empty</label>
            <input id={`${id}-hp`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          {err ? (
            <p className="form-err" role="alert">
              {err}
            </p>
          ) : null}
          <button className="btn btn-gold btn-block" type="submit" disabled={pending}>
            {pending ? "Sending…" : cta} <Icon.arrow />
          </button>
        </div>
      </div>
      <p className="form-note">We&apos;ll call within 24 hours. No spam — your details stay with Ace Minds.</p>
    </form>
  );
}
