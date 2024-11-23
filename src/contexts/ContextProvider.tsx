"use client";
import { AuthProvider } from "./AuthContext";

export default function ContextProvider({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
