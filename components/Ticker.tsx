import Link from "next/link";
import type { Notice } from "@/lib/types";

export function Ticker({ notices }: { notices: Notice[] }) {
  if (!notices.length) return null;
  const items = (hidden: boolean) =>
    notices.map((n, i) => (
      <Link key={`${hidden}-${i}`} href={n.href} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>{n.text}</Link>
    ));
  return (
    <div className="ticker">
      <div className="ticker-inner">
        <span className="ticker-label"><span className="pulse-dot" />Live updates</span>
        <div className="ticker-track">{items(false)}{items(true)}</div>
      </div>
    </div>
  );
}
