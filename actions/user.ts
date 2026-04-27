"use server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/models/User";
import { revalidatePath, revalidateTag } from "next/cache";
import bcrypt from "bcrypt";
import { Workspace } from "@/models/Workspace";
import { List } from "@/models/List";
import { Item } from "@/models/Item";
import type { WorkspaceMemberDB } from "@/types/db/workspace";

export async function updateUserProfile(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();

  if (!name || !email) {
    throw new Error("Missing fields");
  }

  await User.findByIdAndUpdate(user.id, {
    name,
    email,
  });

  revalidateTag(`user-${user.id}`, "max");

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();

  if (!currentPassword || !newPassword) {
    throw new Error("Missing fields");
  }

  const dbUser = await User.findById(user.id);
  if (!dbUser) throw new Error("User not found");

  const isValid = await bcrypt.compare(currentPassword, dbUser.password);
  if (!isValid) throw new Error("Invalid password");

  const hashed = await bcrypt.hash(newPassword, 10);

  dbUser.password = hashed;
  await dbUser.save();

  return { success: true };
}

export async function deleteAccount() {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id.toString();

  const workspaces = await Workspace.find({
    $or: [{ ownerId: user.id }, { "members.userId": user.id }],
  });

  for (const ws of workspaces) {
    const isOwner = ws.ownerId.toString() === userId;

    if (isOwner) {
      await List.deleteMany({ workspaceId: ws._id });
      await Item.deleteMany({ workspaceId: ws._id });
      await Workspace.findByIdAndDelete(ws._id);
    } else {
      ws.members = ws.members.filter(
        (m: WorkspaceMemberDB) => m.userId.toString() !== userId,
      );
      await ws.save();
    }
  }

  await User.findByIdAndDelete(user.id);
  revalidatePath("/settings");
  return { success: true };
}

export async function leaveWorkspace(workspaceId: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Not found");

  const isOwner = workspace.ownerId.toString() === user.id.toString();

  if (isOwner) {
    throw new Error("Owner cannot leave workspace");
  }

  workspace.members = workspace.members.filter(
    (m: WorkspaceMemberDB) => m.userId.toString() !== user.id.toString(),
  );

  await workspace.save();
  revalidateTag(`user-workspaces-${user.id.toString()}`, "max");
  revalidatePath("/workspace");
  return { success: true };
}
