"use client";

import { useState, useTransition } from "react";
import { setEnquiryStatus } from "@/lib/actions/enquiries";

const OPTS = [
  ["new", "Mark new"],
  ["read", "Mark read"],
  ["replied", "Mark replied"],
] as const;

export function EnquiryStatus({ id, status }: { id: string; status: "new" | "read" | "replied" }) {
  const [cur, setCur] = useState(status);
  const [pending, startTransition] = useTransition();

  const set = (next: (typeof OPTS)[number][0]) => {
    if (next === cur || pending) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("status", next);
      await setEnquiryStatus(fd);
      setCur(next);
    });
  };

  return (
    <div className="eq-status" role="group" aria-label="Lead status">
      {OPTS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`btn-s eq-status__btn${cur === key ? ` is-on pill--${key}` : ""}`}
          disabled={pending}
          aria-pressed={cur === key}
          onClick={() => set(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
