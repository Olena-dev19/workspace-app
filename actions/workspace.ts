"use server";
import { connectDB } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { Workspace } from "@/models/Workspace";
import { getCurrentUser } from "@/lib/auth";
import { getUserRole, getWorkspaceById } from "@/lib/workspace";
import { Item } from "@/models/Item";
import { List } from "@/models/List";

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

  revalidateTag(`user-workspaces-${user._id.toString()}`, "max");
  return { success: true };
}

export async function deleteWorkspaces(ids: string[]) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  for (const id of ids) {
    const workspace = await getWorkspaceById(id);
    if (!workspace) continue;

    const role = await getUserRole(workspace, user._id.toString());
    if (role !== "owner" && role !== "admin") {
      throw new Error("Forbitten");
    }
    const lists = await List.find({ workspaceId: id });
    for (const list of lists) {
      await Item.deleteMany({ listId: list._id });
    }

    await List.deleteMany({ workspaceId: id });
    await Workspace.findByIdAndDelete(id);
  }
  revalidateTag(`user-workspaces-${user._id.toString()}`, "max");
  return { success: true };
}
