import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-emerald-700">Movement Dynamics</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Choose a new password</h1>
          <p className="mt-2 text-sm text-slate-500">Use the link from your reset email.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
