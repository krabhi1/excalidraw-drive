"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data, status, update } = useSession();

  return (
    <div>
      Home {status} {JSON.stringify(data)}
    </div>
  );
}
