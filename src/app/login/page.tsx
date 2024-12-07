"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";

export default function Page() {
  const isLoading = false;
  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={() => {
          signIn("google", { redirectTo: "/" });
        }}
      >
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}
