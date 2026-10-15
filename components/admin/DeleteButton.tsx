"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmText,
  label = "Delete",
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await action();
        });
      }}
    >
      <button type="submit" className="btn-s btn-s--danger" disabled={pending}>
        {pending ? "…" : label}
      </button>
    </form>
  );
}
