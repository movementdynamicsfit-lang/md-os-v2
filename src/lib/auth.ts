import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "trainer" | "client";

export interface SessionProfile {
  userId: string;
  fullName: string;
  email: string;
  roles: Role[];
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("full_name, email, is_active").eq("id", user.id).maybeSingle(),
    supabase.rpc("get_my_roles"),
  ]);

  if (profile?.is_active === false) {
    await supabase.auth.signOut();
    return null;
  }

  return {
    userId: user.id,
    fullName: profile?.full_name ?? user.email ?? "User",
    email: profile?.email ?? user.email ?? "",
    roles: (roles ?? []) as Role[],
  };
}

export async function requireRole(role: Role): Promise<SessionProfile> {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.roles.includes(role)) redirect(homeFor(session.roles));
  return session;
}

export function homeFor(roles: Role[]) {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("trainer")) return "/trainer";
  return "/client";
}
