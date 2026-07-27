import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import {
  addLeadSource,
  addLocation,
  addPackage,
  addTrainer,
  saveMonthlyTarget,
  setLeadSourceActive,
  setLocationActive,
  setPackageActive,
  setTrainerActive,
} from "./actions";

type ActiveRow = { id: string; name?: string; display_name?: string; phone?: string | null; is_active: boolean };
type PackageRow = ActiveRow & { session_count: number; price: number };

function Field({
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
    />
  );
}

function StatusButton({
  id,
  isActive,
  action,
}: {
  id: string;
  isActive: boolean;
  action: (id: string, isActive: boolean) => Promise<void>;
}) {
  return (
    <form action={action.bind(null, id, !isActive)}>
      <Button type="submit" variant="quiet" className="px-3 py-2 text-xs">
        {isActive ? "Deactivate" : "Reactivate"}
      </Button>
    </form>
  );
}

function ListCard({
  title,
  children,
  form,
}: {
  title: string;
  children: React.ReactNode;
  form: React.ReactNode;
}) {
  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-950">{title}</h2>
      <div className="mb-4 space-y-2">{children}</div>
      {form}
    </Card>
  );
}

export default async function AdminListsPage() {
  const supabase = await createClient();
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [
    { data: latestTarget },
    { data: trainers },
    { data: locations },
    { data: leadSources },
    { data: packages },
  ] = await Promise.all([
    supabase.from("monthly_targets").select("*").order("target_month", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("trainer_profiles").select("id, display_name, phone, is_active").order("display_name"),
    supabase.from("locations").select("id, name, is_active").order("name"),
    supabase.from("lead_sources").select("id, name, is_active").order("name"),
    supabase.from("package_catalogue").select("id, name, session_count, price, is_active").order("session_count"),
  ]);

  const targetMonth = latestTarget?.target_month ? String(latestTarget.target_month).slice(0, 7) : thisMonth;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-950">Lists / Settings</h1>
      <p className="mb-6 text-sm text-slate-500">
        Shared admin setup used by enquiries, trainer assignment, packages, and reports.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-950">Monthly targets</h2>
          <form action={saveMonthlyTarget} className="grid gap-3 md:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Month</span>
              <input
                name="target_month"
                type="month"
                defaultValue={targetMonth}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Session target</span>
              <input name="session_target" type="number" min="0" defaultValue={latestTarget?.session_target ?? 0} className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Enquiry target</span>
              <input name="enquiry_target" type="number" min="0" defaultValue={latestTarget?.enquiry_target ?? 0} className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Revenue target</span>
              <input name="revenue_target" type="number" min="0" defaultValue={latestTarget?.revenue_target ?? 0} className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500" />
            </label>
            <Button type="submit" className="md:col-span-4">Save targets</Button>
          </form>
        </Card>

        <ListCard
          title="Trainers"
          form={
            <form action={addTrainer} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Field name="display_name" placeholder="Trainer name" required />
              <Field name="phone" placeholder="Phone" />
              <Button type="submit">Add</Button>
            </form>
          }
        >
          {((trainers ?? []) as ActiveRow[]).map((trainer) => (
            <div key={trainer.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
              <div>
                <p className="font-medium text-slate-950">{trainer.display_name}</p>
                <p className="text-xs text-slate-500">{trainer.phone || "No phone"}</p>
              </div>
              <StatusButton id={trainer.id} isActive={trainer.is_active} action={setTrainerActive} />
            </div>
          ))}
          {(trainers ?? []).length === 0 && <p className="text-sm text-slate-500">No trainers yet.</p>}
        </ListCard>

        <ListCard
          title="Locations"
          form={
            <form action={addLocation} className="flex gap-2">
              <Field name="name" placeholder="Add location" required />
              <Button type="submit">Add</Button>
            </form>
          }
        >
          {((locations ?? []) as ActiveRow[]).map((location) => (
            <div key={location.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
              <p className="font-medium text-slate-950">{location.name}</p>
              <StatusButton id={location.id} isActive={location.is_active} action={setLocationActive} />
            </div>
          ))}
        </ListCard>

        <ListCard
          title="Lead sources"
          form={
            <form action={addLeadSource} className="flex gap-2">
              <Field name="name" placeholder="Add source" required />
              <Button type="submit">Add</Button>
            </form>
          }
        >
          {((leadSources ?? []) as ActiveRow[]).map((source) => (
            <div key={source.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
              <p className="font-medium text-slate-950">{source.name}</p>
              <StatusButton id={source.id} isActive={source.is_active} action={setLeadSourceActive} />
            </div>
          ))}
        </ListCard>

        <ListCard
          title="Packages"
          form={
            <form action={addPackage} className="grid gap-2 md:grid-cols-[1fr_120px_120px_auto]">
              <Field name="name" placeholder="Package name" required />
              <Field name="session_count" type="number" placeholder="Sessions" required />
              <Field name="price" type="number" placeholder="Price" required />
              <Button type="submit">Add</Button>
            </form>
          }
        >
          {((packages ?? []) as PackageRow[]).map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
              <div>
                <p className="font-medium text-slate-950">{pkg.name}</p>
                <p className="text-xs text-slate-500">{pkg.session_count} sessions - RM {Number(pkg.price).toLocaleString("en-MY")}</p>
              </div>
              <StatusButton id={pkg.id} isActive={pkg.is_active} action={setPackageActive} />
            </div>
          ))}
        </ListCard>
      </div>
    </div>
  );
}
