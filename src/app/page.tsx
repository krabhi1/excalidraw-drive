"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function Page() {
  const { data, status, update } = useSession();

  return (
    <div>
      <div>
        <Button onClick={() => signOut()}>SignOut</Button>
      </div>
      Home {status} {JSON.stringify(data)}
    </div>
  );
}
