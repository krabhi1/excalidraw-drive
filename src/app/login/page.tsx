"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TokenResponse } from "@react-oauth/google";
import useGoogleLogin from "@/hooks/use-google";

export default function Page() {
  const router = useRouter();
  const { error, user, isLoading, login } = useGoogleLogin();
  console.log(error, user);

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
  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={() => {
          login();
        }}
      >
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}
