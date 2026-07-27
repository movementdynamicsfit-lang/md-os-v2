"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const redirectTo = `${appUrl}/auth/callback?next=/reset-password`;
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);

    if (error) {
      setError("Could not send the reset email. Try again.");
      return;
    }

    setMessage("If that email has an account, a reset link is on its way.");
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Sending..." : "Send reset link"}
        </Button>
        <Link href="/login" className="block text-center text-sm text-slate-500 hover:underline">
          Back to sign in
        </Link>
      </form>
    </Card>
  );
}
