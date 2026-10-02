import Link from "next/link";
import { ACE } from "@/lib/data";

export function Ticker() {
  const items = (hidden: boolean) =>
    ACE.notices.map((n, i) => (
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
