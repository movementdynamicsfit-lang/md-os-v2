import Link from "next/link";
import { LogoutButton } from "@/components/nav/LogoutButton";

export function AppShell({
  title,
  userName,
  items,
  children,
}: {
  title: string;
  userName: string;
  items: Array<{ href: string; label: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 p-5 text-white md:block">
        <div className="mb-8">
          <p className="text-sm text-emerald-300">Movement Dynamics</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
            <p className="font-medium text-slate-900">{userName}</p>
          </div>
          <LogoutButton />
        </header>
        <main className="mx-auto max-w-6xl p-5">{children}</main>
      </div>
    </div>
  );
}
