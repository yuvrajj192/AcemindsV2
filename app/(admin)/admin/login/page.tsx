import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import "../admin.css";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="alogin">
      <div className="alogin__card">
        <div className="alogin__brand">
          Ace Minds <em>Admin</em>
        </div>
        <p className="alogin__hint">Staff sign-in for aceminds.in</p>
        <LoginForm />
        <a className="alogin__back" href="/">
          Back to site
        </a>
      </div>
    </div>
  );
}
