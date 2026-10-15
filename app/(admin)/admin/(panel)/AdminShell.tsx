"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/session";

type NavItem = { href: string; label: string } | { href: string; label: string; soon: true };
type NavSection = { section: string; items: NavItem[] };

const NAV: NavSection[] = [
  { section: "Overview", items: [{ href: "/admin", label: "Dashboard" }] },
  {
    section: "Content",
    items: [
      { href: "/admin/courses", label: "Courses", soon: true },
      { href: "/admin/toppers", label: "Toppers & Results" },
      { href: "/admin/faculty", label: "Faculty" },
      { href: "/admin/slides", label: "Sliders" },
      { href: "/admin/posters", label: "Posters", soon: true },
      { href: "/admin/faqs", label: "FAQs", soon: true },
      { href: "/admin/notices", label: "Notice ticker", soon: true },
      { href: "/admin/testimonials", label: "Testimonials", soon: true },
    ],
  },
  { section: "Blog", items: [{ href: "/admin/posts", label: "Posts" }] },
  {
    section: "Library",
    items: [
      { href: "/admin/media", label: "Media" },
      { href: "/admin/enquiries", label: "Enquiries", soon: true },
    ],
  },
  { section: "System", items: [{ href: "/admin/settings", label: "Settings", soon: true }] },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href;
}

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [loggingOut, startLogout] = useTransition();

  const title =
    NAV.flatMap((s) => s.items).find((i) => isActive(pathname, i.href))?.label ?? "Dashboard";

  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__brand">
          Ace Minds <em>Admin</em>
        </div>
        <nav className="adm__nav" aria-label="Admin">
          {NAV.map((group) => (
            <div className="adm__group" key={group.section}>
              <div className="adm__group-title">{group.section}</div>
              {group.items.map((item) =>
                "soon" in item ? (
                  <span className="adm__link adm__link--soon" key={item.href} aria-disabled="true">
                    {item.label}
                    <b>soon</b>
                  </span>
                ) : (
                  <Link
                    className={`adm__link${isActive(pathname, item.href) ? " is-active" : ""}`}
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </nav>
        <div className="adm__user">
          <div className="adm__user-meta">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <form
            action={() =>
              startLogout(async () => {
                await logout();
                window.location.assign("/admin/login");
              })
            }
          >
            <button className="adm__logout" type="submit" disabled={loggingOut}>
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </form>
        </div>
      </aside>

      <div className="adm__main">
        <header className="adm__top">
          <h1 className="adm__title">{title}</h1>
          <Link className="adm__view" href="/" target="_blank">
            View site
          </Link>
        </header>
        <div className="adm__body">{children}</div>
      </div>
    </div>
  );
}
