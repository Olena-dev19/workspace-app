import { connectDB } from "@/lib/db";
import SignIn from "./(auth)/sign-in/SignIn";
import React, { Suspense } from "react";

export default async function Home() {
  await connectDB();
  return (
    <>
      <h1>Welcome to the Workspace App</h1>
      <Suspense fallback={<div>Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </>
  );
}
