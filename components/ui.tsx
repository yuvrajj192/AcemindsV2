"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icons";
import { EnquiryForm } from "./EnquiryForm";
import { ACE } from "@/lib/data";

/* ---------------------------------------------------------------------------
   Global UI: enquiry modal, video modal, floating actions and alert toast.
   Any component can call useUI().enquire() / useUI().playVideo().
--------------------------------------------------------------------------- */

type EnquireOpts = { course?: string; brochure?: boolean };
type UI = { enquire: (o?: EnquireOpts) => void; playVideo: (url: string) => void };

const Ctx = createContext<UI>({ enquire: () => {}, playVideo: () => {} });
export const useUI = () => useContext(Ctx);

function Modal({ open, onClose, children, label, className = "" }: { open: boolean; onClose: () => void; children: ReactNode; label: string; className?: string }) {
  const lastFocus = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.classList.add("lock");
    const t = setTimeout(() => boxRef.current?.querySelector<HTMLElement>("input, button.modal-close")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lock");
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);
  return (
    <div className={`modal${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open}>
      <div className="modal-backdrop" onClick={onClose} />
      <div ref={boxRef} className={className}>
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}><Icon.close /></button>
        {children}
      </div>
    </div>
  );
}

function AlertToast() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("ace_toast") === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => setShow(true), 9000);
    return () => clearTimeout(t);
  }, []);
  const close = () => {
    setShow(false);
    try { sessionStorage.setItem("ace_toast", "1"); } catch {}
  };
  const S = ACE.site;
  return (
    <div className={`toast${show ? " show" : ""}`} role="dialog" aria-live="polite" aria-label="Result alerts">
      <span className="ico"><Icon.bell /></span>
      <div>
        <strong>Never miss a result</strong>
        <p>Get exam dates, results &amp; scholarship alerts on WhatsApp.</p>
        <div className="toast-actions">
          <a className="btn btn-sm" href={`https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Please add me to Ace Minds exam alerts")}`} target="_blank" rel="noopener" onClick={close}>Join alerts</a>
          <button className="btn btn-sm btn-ghost" type="button" onClick={close}>Later</button>
        </div>
      </div>
    </div>
  );
}

function FloatingActions({ onEnquire }: { onEnquire: () => void }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const S = ACE.site;
  return (
    <>
      <button className="enquire-tab" type="button" onClick={onEnquire}>Enquire now</button>
      <div className="fab-stack">
        <button className={`fab top${showTop ? " show" : ""}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon.up /></button>
        <a className="fab call" href={`tel:${S.phoneRaw}`} aria-label="Call us"><Icon.phone /></a>
        <a className="fab wa" href={`https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Hi Ace Minds, I'd like to know about admissions.")}`} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><Icon.whatsapp /></a>
      </div>
      <div className="mobile-bar">
        <a href={`tel:${S.phoneRaw}`}><Icon.phone />Call</a>
        <a className="wa" href={`https://wa.me/${S.whatsapp}`} target="_blank" rel="noopener"><Icon.whatsapp />WhatsApp</a>
        <button type="button" onClick={onEnquire}>Free demo</button>
      </div>
    </>
  );
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [enq, setEnq] = useState<EnquireOpts | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const enquire = useCallback((o: EnquireOpts = {}) => {
    document.body.classList.remove("nav-open");
    setFormKey((k) => k + 1); // fresh form each time
    setEnq(o);
  }, []);
  const playVideo = useCallback((url: string) => setVideo(url), []);
  const closeEnq = useCallback(() => setEnq(null), []);
  const closeVideo = useCallback(() => setVideo(null), []);

  return (
    <Ctx.Provider value={{ enquire, playVideo }}>
      {children}

      <Modal open={!!enq} onClose={closeEnq} label="Book a free demo class" className="modal-box">
        <div className="modal-side on-dark">
          <span className="hand" style={{ color: "var(--gold-400)", fontSize: "1.6rem" }}>Try before you join</span>
          <h3>Book a free<br />demo class</h3>
          <p style={{ color: "rgba(255,255,255,.7)" }}>Sit in a live Ace Minds class, meet the faculty and get a personalised study plan.</p>
          <ul>
            <li>Live class with IIT alumni faculty</li>
            <li>Free diagnostic test &amp; report</li>
            <li>One-on-one counselling session</li>
            <li>Scholarship eligibility check</li>
          </ul>
        </div>
        <div className="modal-main">
          <span className="eyebrow">Free counselling</span>
          <h3 style={{ fontSize: "1.6rem", marginBottom: 18 }}>{enq?.brochure ? "Get the 2026–27 brochure" : "Tell us about the student"}</h3>
          <EnquiryForm key={formKey} id="m" source={enq?.brochure ? "brochure" : "modal"} defaultCourse={enq?.course} />
        </div>
      </Modal>

      <Modal open={!!video} onClose={closeVideo} label="Video" className="video-box">
        {video && (
          <iframe
            src={`${video}${video.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
            title="Ace Minds video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </Modal>

      <FloatingActions onEnquire={() => enquire()} />
      <AlertToast />
    </Ctx.Provider>
  );
}

/* ---------- small client buttons usable from Server Components ---------- */

export function EnquireButton({ children, className = "btn", course, brochure, style }: { children: ReactNode; className?: string; course?: string; brochure?: boolean; style?: React.CSSProperties }) {
  const { enquire } = useUI();
  return <button type="button" className={className} style={style} onClick={() => enquire({ course, brochure })}>{children}</button>;
}

export function VideoButton({ url, children, className, label, style }: { url: string; children: ReactNode; className?: string; label?: string; style?: React.CSSProperties }) {
  const { playVideo } = useUI();
  return <button type="button" className={className} style={style} aria-label={label} onClick={() => playVideo(url)}>{children}</button>;
}
