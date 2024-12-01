"use client";

import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { email, name, photoUrl } = useAuth();
  return (
    <div>
      Home {email} {name}
    </div>
  );
}
