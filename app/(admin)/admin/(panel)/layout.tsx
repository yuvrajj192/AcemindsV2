import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminShell } from "./AdminShell";
import "../admin.css";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
