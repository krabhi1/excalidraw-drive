import { useUserStore } from "@/store/user-store";
import { toast, useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export type AuthContextType = {
  email: string;
  name: string;
  photoUrl: string;
  accessToken: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);
type AuthContextProviderProps = React.PropsWithChildren<{
  unProtectedPaths?: string[];
}>;

export function AuthProvider({
  children,
  unProtectedPaths,
}: AuthContextProviderProps) {
  const unprotectedPaths = unProtectedPaths || ["/login", "/demo"];
  const [authData, setAuthData] = useState<AuthContextType>({
    name: "",
    email: "",
    photoUrl: "",
    accessToken: "",
  });
  const { user, isLoading, error } = useUserStore();

  const path = usePathname();
  const navigate = useRouter();

  const isProtected = !unprotectedPaths.includes(path);

  useEffect(() => {
    if (!user && !isLoading && isProtected) {
      //wait for error
      navigate.push("/login");
    }
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [user, isLoading, error, isProtected, toast]);
  useEffect(() => {
    if (user) {
      setAuthData({
        ...user,
      });
    }
  }, [user]);
  //redirect to signin
  if (isLoading) return "Loading...";
  if (!user && isProtected) {
    return null;
  }
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
