"use client";
import { AuthProvider } from "./AuthContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
