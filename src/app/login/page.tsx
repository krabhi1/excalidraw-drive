"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { signIn, useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const { error, user, isLoading, login } = {} as any;
  const { data, status, update } = useSession();

  console.log("login", data, status);

  useEffect(() => {
    //just back to home
    if (user) {
      router.push("/");
    } else if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [router, error, user]);

  async function onLogin() {
    const result = await signIn("google");
    console.log({ result });
  }
  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={() => {
          onLogin();
        }}
      >
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}
