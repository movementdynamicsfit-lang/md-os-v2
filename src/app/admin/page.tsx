import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-950">Admin dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Phase 1 keeps this deliberately simple: accounts, roles, and clean access.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="font-semibold">People</p>
          <p className="mt-1 text-sm text-slate-500">Profiles and role assignments.</p>
          <Link href="/admin/people" className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline">
            Open people
          </Link>
        </Card>
        <Card>
          <p className="font-semibold">Trainers</p>
          <p className="mt-1 text-sm text-slate-500">Next phase: trainer profiles and client links.</p>
        </Card>
        <Card>
          <p className="font-semibold">Clients</p>
          <p className="mt-1 text-sm text-slate-500">Next phase: client records and access invitations.</p>
        </Card>
      </div>
    </div>
  );
}
