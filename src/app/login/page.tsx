"use client";
import { Button } from "@/components/ui/button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/configs/firebase";
import { ReloadIcon } from "@radix-ui/react-icons";
import { scopes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();

  useEffect(() => {
    //just back to home
    if (user) {
      router.push("/");
    } else if (error) {
      toast({
        title: "Error: " + error.name,
        description: error.message,
        variant: "destructive",
      });
    }
  }, [router, user, error]);
  return (
    <div>
      <Button
        disabled={loading}
        onClick={() => {
          signInWithGoogle(scopes);
        }}
      >
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}
