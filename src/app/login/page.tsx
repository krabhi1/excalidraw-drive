"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TokenResponse } from "@react-oauth/google";
import useGoogle from "@/hooks/use-google";

export default function Page() {
  const router = useRouter();
  const { error, data, loading, login } = useGoogle();

  useEffect(() => {
    //just back to home
    if (data) {
      console.log(data);
      router.push("/");
    } else if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [router, error, data]);
  return (
    <div>
      <Button
        disabled={loading}
        onClick={() => {
          login();
        }}
      >
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}
