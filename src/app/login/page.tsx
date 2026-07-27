import { redirect } from "next/navigation";
import { getSessionProfile, homeFor } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSessionProfile();
  if (session) redirect(homeFor(session.roles));

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-emerald-700">Movement Dynamics</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Use the account invited by the team.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
