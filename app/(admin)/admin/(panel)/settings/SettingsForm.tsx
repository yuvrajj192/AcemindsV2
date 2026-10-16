"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/lib/actions/site";
import type { SiteInfo } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteInfo }) {
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    setSaved(false);
    startTransition(async () => {
      const res = await saveSiteSettings(fd);
      if (!res.ok) setErr(res.error);
      else setSaved(true);
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <span className="frm__hint">Site-wide settings — shown on every public page</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      {saved ? <p className="frm__ok">Settings saved. Public site refreshed.</p> : null}

      <h2 className="set__section">Identity</h2>
      <div className="frm__grid">
        <label className="frm__field">
          <span>Name *</span>
          <input name="name" defaultValue={initial.name} required maxLength={120} />
        </label>
        <label className="frm__field">
          <span>Tagline *</span>
          <input name="tagline" defaultValue={initial.tagline} required maxLength={160} />
        </label>
        <label className="frm__field">
          <span>Initiative line</span>
          <input name="initiative" defaultValue={initial.initiative} maxLength={160} placeholder="An IIT Alumni Initiative" />
        </label>
        <label className="frm__field">
          <span>Domain</span>
          <input name="domain" defaultValue={initial.domain} maxLength={120} placeholder="aceminds.in" />
        </label>
        <label className="frm__field">
          <span>Founded year</span>
          <input name="founded" type="number" min={1950} max={2100} defaultValue={initial.founded} />
        </label>
      </div>

      <h2 className="set__section">Contact</h2>
      <div className="frm__grid">
        <label className="frm__field">
          <span>Phone (display)</span>
          <input name="phone" defaultValue={initial.phone} maxLength={40} placeholder="+91 90000 00000" />
        </label>
        <label className="frm__field">
          <span>Phone (raw, for tel: links)</span>
          <input name="phoneRaw" defaultValue={initial.phoneRaw} maxLength={20} placeholder="+919000000000" />
        </label>
        <label className="frm__field">
          <span>WhatsApp (with country code)</span>
          <input name="whatsapp" defaultValue={initial.whatsapp} maxLength={20} placeholder="919000000000" />
        </label>
        <label className="frm__field">
          <span>Email *</span>
          <input name="email" type="email" defaultValue={initial.email} required maxLength={200} />
        </label>
        <label className="frm__field frm__field--full">
          <span>Address</span>
          <textarea name="address" rows={2} defaultValue={initial.address} maxLength={400} />
        </label>
        <label className="frm__field frm__field--full">
          <span>Working hours</span>
          <input name="hours" defaultValue={initial.hours} maxLength={160} placeholder="Mon – Sat · 8:00 AM – 8:00 PM" />
        </label>
        <label className="frm__field frm__field--full">
          <span>Google Maps embed (paste the embed code or just the URL)</span>
          <textarea
            name="mapEmbed"
            rows={2}
            defaultValue={initial.mapEmbed}
            maxLength={2000}
            placeholder={'<iframe src="https://www.google.com/maps/embed?..."></iframe> — the src URL is extracted automatically'}
          />
        </label>
      </div>

      <h2 className="set__section">Social & downloads</h2>
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>YouTube URL</span>
          <input name="youtube" defaultValue={initial.youtube} maxLength={300} placeholder="https://www.youtube.com/@aceminds" />
        </label>
        <label className="frm__field frm__field--full">
          <span>Instagram URL</span>
          <input name="instagram" defaultValue={initial.instagram} maxLength={300} placeholder="https://www.instagram.com/aceminds" />
        </label>
        <label className="frm__field frm__field--full">
          <span>Facebook URL</span>
          <input name="facebook" defaultValue={initial.facebook} maxLength={300} placeholder="https://www.facebook.com/aceminds" />
        </label>
        <label className="frm__field frm__field--full">
          <span>Brochure URL</span>
          <input name="brochure" defaultValue={initial.brochure} maxLength={300} placeholder="#brochure or an R2 / external PDF link" />
        </label>
      </div>

      <div className="frm__actions">
        <button className="btn-gold btn-gold--sm" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
