"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSession, signOut } from "next-auth/react";

export default function Page() {
  const auth = useAuth();

  return (
    <div>
      <div>
        <Button onClick={() => signOut()}>SignOut</Button>
      </div>
      Home {JSON.stringify(auth)}
    </div>
  );
}
