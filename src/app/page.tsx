import { redirect } from "next/navigation";
import { getSessionProfile, homeFor } from "@/lib/auth";

export default async function Home() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  redirect(homeFor(session.roles));
}
