import { Card } from "@/components/ui/Card";

export default function ClientDashboard() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-950">Client dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Next phase: profile, assigned trainer, and package visibility.</p>
      <Card>
        <p className="font-semibold">Foundation ready</p>
        <p className="mt-1 text-sm text-slate-500">If you can see this, client login and role protection are working.</p>
      </Card>
    </div>
  );
}
