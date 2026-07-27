import { AppShell } from "@/components/nav/AppShell";
import { requireRole } from "@/lib/auth";

const NAV = [{ href: "/trainer", label: "Dashboard" }];

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("trainer");
  return (
    <AppShell title="Trainer" userName={session.fullName} items={NAV}>
      {children}
    </AppShell>
  );
}
