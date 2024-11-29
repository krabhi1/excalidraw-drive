"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import { env } from "@/configs/env";
import { scopes } from "@/lib/utils";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
