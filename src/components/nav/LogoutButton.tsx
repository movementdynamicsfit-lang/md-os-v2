"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="quiet"
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
