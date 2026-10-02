"use client";

import { useState } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);
  if (done) return <p className="newsletter" style={{ padding: "8px 14px", color: "var(--gold-400)", fontWeight: 700 }}>✓ You&apos;re on the list!</p>;
  return (
    <form
      className="newsletter"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const inp = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        if (!inp.checkValidity()) return inp.focus();
        setDone(true);
      }}
    >
      <label className="sr-only" htmlFor="nl-email">Email</label>
      <input id="nl-email" name="email" type="email" placeholder="Get exam alerts by email" required />
      <button className="btn btn-gold btn-sm" type="submit">Notify me</button>
    </form>
  );
}
