"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setError("Email or password does not match.");
      return;
    }

    router.push("/");
    router.refresh();
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
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-emerald-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in..." : "Sign in"}
        </Button>
        <Link href="/forgot-password" className="block text-center text-sm text-emerald-700 hover:underline">
          Forgot your password?
        </Link>
      </form>
    </Card>
  );
}
