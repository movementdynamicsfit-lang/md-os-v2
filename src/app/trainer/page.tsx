import { Card } from "@/components/ui/Card";

export default function TrainerDashboard() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-950">Trainer dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Next phase: assigned clients, profile, and sessions.</p>
      <Card>
        <p className="font-semibold">Foundation ready</p>
        <p className="mt-1 text-sm text-slate-500">If you can see this, trainer login and role protection are working.</p>
      </Card>
    </div>
  );
}
