import { getSiteSettings } from "@/lib/queries";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const site = await getSiteSettings();
  return (
    <div className="adm__page">
      <div className="adm__head">
        <h1>Settings</h1>
        <p>Contact details, socials and identity shown across the public site.</p>
      </div>
      <SettingsForm initial={site} />
    </div>
  );
}
