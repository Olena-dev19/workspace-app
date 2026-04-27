import { connectDB } from "@/lib/db";
import SignIn from "./(auth)/sign-in/SignIn";

export default async function Home() {
  await connectDB();
  return (
    <>
      <h1>Welcome to the Workspace App</h1>
      <SignIn />
    </>
  );
}
