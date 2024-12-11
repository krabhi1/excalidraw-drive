"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="fixed flex justify-center items-center w-screen h-screen">
      <Button
        onClick={() => {
          signIn("google", { redirectTo: "/" });
        }}
      >
        {/* {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} */}
        Login with Google
      </Button>
    </div>
  );
}
