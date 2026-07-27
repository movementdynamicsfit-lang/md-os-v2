import { AppShell } from "@/components/nav/AppShell";
import { requireRole } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/people", label: "People" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("admin");
  return (
    <AppShell title="Admin" userName={session.fullName} items={NAV}>
      {children}
    </AppShell>
  );
}
