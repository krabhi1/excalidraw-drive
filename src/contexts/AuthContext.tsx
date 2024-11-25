import { auth } from "@/configs/firebase";
import { toast, useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export type AuthContextType = {
  email: string;
  uid: string;
  name: string;
  photoUrl: string;
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
    uid: "",
  });
  const [user, loading, error] = useAuthState(auth);

  const path = usePathname();
  const navigate = useRouter();

  const isProtected = !unprotectedPaths.includes(path);

  useEffect(() => {
    if (!user && !loading && isProtected) {
      //wait for error
      navigate.push("/login");
    }
    if (error) {
      toast({
        title: "Error: " + error.name,
        description: error.message,
        variant: "destructive",
      });
    }
  }, [user, loading, error, isProtected, toast]);
  useEffect(() => {
    if (user) {
      setAuthData({
        name: user.displayName || "",
        email: user.email || "",
        photoUrl: user.photoURL || "",
        uid: user.uid,
      });
    }
  }, [user]);
  //redirect to signin
  if (loading) return "Loading...";
  if (!user && isProtected) {
    return null;
  }
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
