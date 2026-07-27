"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError("This reset link is invalid or expired. Request a new reset email.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">New password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Confirm password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </Card>
  );
}
