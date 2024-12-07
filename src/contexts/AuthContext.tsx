import { toast, useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export type AuthContextType = {};

export const AuthContext = createContext<AuthContextType | null>(null);
type AuthContextProviderProps = React.PropsWithChildren<{
  unProtectedPaths?: string[];
}>;

export function AuthProvider({
  children,
  unProtectedPaths,
}: AuthContextProviderProps) {
  const unprotectedPaths = unProtectedPaths || ["/login", "/demo"];
  const [authData, setAuthData] = useState<AuthContextType>({});
  const { data, status, update } = useSession();
  const path = usePathname();
  const navigate = useRouter();

  const isProtected = !unprotectedPaths.includes(path);
  useEffect(() => {
    if (!data && status != "loading" && isProtected) {
      //wait for error
      navigate.push("/login");
    }
    // if (status=='unauthenticated') {
    //   toast({
    //     title: "Error",
    //     description: error,
    //     variant: "destructive",
    //   });
    // }
  }, [data, status, isProtected, toast]);
  useEffect(() => {}, [data]);
  //redirect to signin
  if (status == "loading") return "Loading...";
  if (!data && isProtected) {
    return null;
  }
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
