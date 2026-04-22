"use server";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function registerUser(formData: FormData) {
  await connectDB();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
    name,
  });

  redirect("/workspace");
}
