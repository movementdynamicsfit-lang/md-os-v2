import { AppShell } from "@/components/nav/AppShell";
import { requireRole } from "@/lib/auth";

const NAV = [{ href: "/client", label: "Dashboard" }];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("client");
  return (
    <AppShell title="Client" userName={session.fullName} items={NAV}>
      {children}
    </AppShell>
  );
}
