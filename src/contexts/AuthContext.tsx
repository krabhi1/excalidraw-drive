import { toast, useToast } from "@/hooks/use-toast";
import { initDriveApi } from "@/lib/drive";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export type AuthContextType = {
  name: string;
  email: string;
  imageUrl: string;
  googleAccessToken: string;
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
  const [authData, setAuthData] = useState<AuthContextType | null>(null);
  const { data: session, status, update } = useSession();
  const path = usePathname();
  const navigate = useRouter();

  const isProtected = !unprotectedPaths.includes(path);
  useEffect(() => {
    if (!session?.user && status != "loading" && isProtected) {
      //wait for error
      navigate.push("/login");
    }
    if (session?.error) {
      toast({
        title: "Error",
        description: session.error,
        variant: "destructive",
      });
    }
  }, [session, status, isProtected, toast]);
  useEffect(() => {
    if (session?.user) {
      setAuthData({
        email: session.user.email || "",
        googleAccessToken: session.access_token || "",
        imageUrl: session.user.image || "",
        name: session.user.name || "",
      });
      initDriveApi({
        token: session.access_token,
      });
    }
  }, [session]);

  if ((status == "loading" || !authData) && isProtected)
    return (
      <div className="fixed w-full h-full  flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  if (!session && isProtected) {
    return null;
  }
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
