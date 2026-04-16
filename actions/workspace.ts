"use server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { revalidateTag } from "next/cache";
import { Workspace } from "@/models/Workspace";
import { getCurrentUser } from "@/lib/auth";

export async function createWorkspace(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    throw new Error("Name is required");
  }

  await Workspace.create({
    name,
    description,
    ownerId: user._id,
    members: [{ userId: user._id, role: "owner" }],
  });

  revalidateTag("workspaces", "max");
  return { success: true };
}
