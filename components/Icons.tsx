import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const stroke = (w = 2) => ({ fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const Icon = {
  arrow: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.4)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  left: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.4)} {...p}><path d="M15 6l-6 6 6 6" /></svg>,
  right: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.4)} {...p}><path d="M9 6l6 6-6 6" /></svg>,
  down: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.6)} {...p}><path d="M6 9l6 6 6-6" /></svg>,
  up: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.6)} {...p}><path d="M6 15l6-6 6 6" /></svg>,
  close: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.6)} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  phone: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>,
  mail: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>,
  pin: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z" /><circle cx="12" cy="10" r="3" /></svg>,
  clock: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  download: (p: P) => <svg viewBox="0 0 24 24" {...stroke(2.4)} {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>,
  play: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" /></svg>,
  star: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>,
  check: (p: P) => <svg viewBox="0 0 24 24" {...stroke(3)} {...p}><path d="M5 12l5 5L20 7" /></svg>,
  bell: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>,
  whatsapp: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.7 14.7 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6A11.8 11.8 0 0 0 1.9 18L.2 24l6.2-1.6A11.8 11.8 0 1 0 12 .2z" /></svg>,
  youtube: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" /></svg>,
  instagram: (p: P) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  facebook: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M15.1 5.3H17V2.1A25 25 0 0 0 14.3 2c-2.7 0-4.5 1.7-4.5 4.7v2.7H6.8v3.6h3V22h3.7v-9h3l.4-3.6h-3.4V7.1c0-1 .3-1.8 1.6-1.8z" /></svg>,
  target: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  cap: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6" /></svg>,
  clipboard: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 2h6v4H9zM9 12l2 2 4-4M9 18h6" /></svg>,
  heart: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  bulb: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>,
  users: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
  trophy: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>,
  chart: (p: P) => <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 6-6" /></svg>,
  google: (p: P) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;

export function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => <Icon.star key={i} />)}
    </span>
  );
}

export function Logo() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="amA" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#e63946" /><stop offset="1" stopColor="#f28c28" /></linearGradient>
        <linearGradient id="amM" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2e7bea" /><stop offset="1" stopColor="#1f427a" /></linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#fbf3e4" stroke="#0a1730" strokeWidth="4" />
      <path d="M11 47 L22 15 L33 47" fill="none" stroke="url(#amA)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 36 H28.5" stroke="#f7c234" strokeWidth="5" strokeLinecap="round" />
      <path d="M31 47 V17 L41 33 L51 17 V47" fill="none" stroke="url(#amM)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
