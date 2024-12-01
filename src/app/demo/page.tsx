"use client";
import { Button } from "@/components/ui/button";
import { driveTest } from "@/lib/drive";
import { useEffect } from "react";

function getAccessToken() {
  return JSON.parse(localStorage.getItem("user")!).accessToken as string;
}
export default function Page() {
  function call() {
    const token = getAccessToken();
    console.log(token);
    driveTest(token);
  }
  return (
    <div>
      <Button onClick={call}>click</Button>
    </div>
  );
}
