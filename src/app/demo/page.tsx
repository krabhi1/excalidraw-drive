"use client";
import { Button } from "@/components/ui/button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/configs/firebase";
import { ReloadIcon } from "@radix-ui/react-icons";
import { scopes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { env } from "@/configs/env";
export default function Page() {
  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <Example2 />
    </GoogleOAuthProvider>
  );
}

function Example1() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const router = useRouter();

  useEffect(() => {
    //just back to home
    if (user) {
      const cred = GoogleAuthProvider.credentialFromResult(user);
      console.log(user, cred);
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
          signInWithGoogle(scopes, {
            prompt: "consent",
            access_type: "offline",
          });
        }}
      >
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Signin with Google
      </Button>
    </div>
  );
}

function Example2() {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    scope: "",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        code: codeResponse.code,
      });
      if (res.data) {
        const { id_token } = res.data.tokens;
        try {
          const cred = await signInWithCredential(
            auth,
            GoogleAuthProvider.credential(id_token)
          );
          console.log(cred);
        } catch (error) {
          console.log(error);
        }
      }

      console.log(res);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <Button onClick={googleLogin}>Login</Button>
    </div>
  );
}
