"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmText,
  label = "Delete",
  redirect,
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
  redirect?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await action();
          // detail pages: the row is gone after delete, so going back would 404
          if (redirect) router.push(redirect);
        });
      }}
    >
      <button type="submit" className="btn-s btn-s--danger" disabled={pending}>
        {pending ? "…" : label}
      </button>
    </form>
  );
}
