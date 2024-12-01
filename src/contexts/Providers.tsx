"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import { env } from "@/configs/env";
import { scopes } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";

export default function Providers({ children }: React.PropsWithChildren) {
  //init
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      useUserStore.getState().setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);
  if (isLoading) return null;
  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
