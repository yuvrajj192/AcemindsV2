"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/* Fades children in when scrolled into view. `stagger` cascades direct children. */
export function Reveal({
  as: Tag = "div", stagger, className = "", children, style, id,
}: { as?: ElementType; stagger?: boolean; className?: string; children?: ReactNode; style?: CSSProperties; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cls = `${stagger ? "reveal-stagger" : "reveal"}${seen ? " is-visible" : ""} ${className}`.trim();
  return <Tag ref={ref} className={cls} style={style} id={id}>{children}</Tag>;
}

/* Counts up from 0 when visible. */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / 1600, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <strong ref={ref}>{n.toLocaleString("en-IN")}{suffix && <sup>{suffix}</sup>}</strong>;
}
