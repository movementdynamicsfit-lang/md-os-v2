import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

type PersonRow = {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  role_assignments: Array<{ role: string }>;
};

export default async function PeoplePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_active, role_assignments(role)")
    .order("full_name");

  const people = (data ?? []) as PersonRow[];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-950">People</h1>
      <p className="mb-6 text-sm text-slate-500">Read-only for Phase 1. Creation and invitations come next.</p>

      <Card>
        {error && <p className="text-sm text-red-600">Could not load people: {error.message}</p>}
        {!error && people.length === 0 && <p className="text-sm text-slate-500">No profiles yet.</p>}
        {!error && people.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Roles</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 font-medium text-slate-950">{person.full_name}</td>
                    <td className="py-3 text-slate-600">{person.email}</td>
                    <td className="py-3 text-slate-600">
                      {person.role_assignments.map((r) => r.role).join(", ") || "None"}
                    </td>
                    <td className="py-3">
                      <span className={person.is_active ? "text-emerald-700" : "text-slate-500"}>
                        {person.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
