import { requireSession } from "@/lib/session";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { AccountInfo } from "@/components/settings/account-info";

export default async function SettingsPage() {
  await requireSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences and account.
        </p>
      </div>

      <ThemeSelector />
      <AccountInfo />
    </div>
  );
}
