"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const LISTS_PATH = "/admin/lists";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export async function saveMonthlyTarget(formData: FormData) {
  await requireRole("admin");
  const targetMonth = text(formData, "target_month");
  if (!targetMonth) return;

  const supabase = await createClient();
  await supabase.from("monthly_targets").upsert(
    {
      target_month: `${targetMonth}-01`,
      session_target: numberValue(formData, "session_target"),
      enquiry_target: numberValue(formData, "enquiry_target"),
      revenue_target: numberValue(formData, "revenue_target"),
    },
    { onConflict: "target_month" },
  );
  revalidatePath(LISTS_PATH);
}

export async function addTrainer(formData: FormData) {
  await requireRole("admin");
  const displayName = text(formData, "display_name");
  if (!displayName) return;

  const supabase = await createClient();
  await supabase.from("trainer_profiles").insert({
    display_name: displayName,
    phone: text(formData, "phone") || null,
  });
  revalidatePath(LISTS_PATH);
}

export async function setTrainerActive(id: string, isActive: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("trainer_profiles").update({ is_active: isActive }).eq("id", id);
  revalidatePath(LISTS_PATH);
}

export async function addLocation(formData: FormData) {
  await requireRole("admin");
  const name = text(formData, "name");
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("locations").insert({ name });
  revalidatePath(LISTS_PATH);
}

export async function setLocationActive(id: string, isActive: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("locations").update({ is_active: isActive }).eq("id", id);
  revalidatePath(LISTS_PATH);
}

export async function addLeadSource(formData: FormData) {
  await requireRole("admin");
  const name = text(formData, "name");
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("lead_sources").insert({ name });
  revalidatePath(LISTS_PATH);
}

export async function setLeadSourceActive(id: string, isActive: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("lead_sources").update({ is_active: isActive }).eq("id", id);
  revalidatePath(LISTS_PATH);
}

export async function addPackage(formData: FormData) {
  await requireRole("admin");
  const name = text(formData, "name");
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("package_catalogue").insert({
    name,
    session_count: numberValue(formData, "session_count"),
    price: numberValue(formData, "price"),
  });
  revalidatePath(LISTS_PATH);
}

export async function setPackageActive(id: string, isActive: boolean) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("package_catalogue").update({ is_active: isActive }).eq("id", id);
  revalidatePath(LISTS_PATH);
}
