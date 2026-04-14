"use server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { Workspace } from "@/models/Workspace";
import { User } from "@/models/User";

export async function createWorkspace(formData: FormData) {
  await connectDB();

  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    throw new Error("Name is required");
  }
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    throw new Error("User not found");
  }

  await Workspace.create({
    name,
    description,
    ownerId: user._id,
    members: [{ userId: user._id, role: "owner" }],
  });

  revalidatePath("/w");
}
