"use server";
import { connectDB } from "@/lib/db";
import { isWorkspaceMember } from "@/lib/workspace";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspaceById } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { List } from "@/models/List";
import { Item } from "@/models/Item";

export async function createList(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const workspaceId = formData.get("workspaceId")?.toString();

  if (!name) throw new Error("Name is required");
  if (!workspaceId) throw new Error("Workspace ID missing");

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const isMember = isWorkspaceMember(workspace, user.id.toString());
  if (!isMember) throw new Error("You are not a member of this workspace");

  await List.create({
    name,
    workspaceId,
    description,
    createdBy: user.id,
  });

  revalidatePath(`/workspace/${workspaceId}`);
  return { success: true };
}

export async function deleteLists(ids: string[]) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  for (const id of ids) {
    const list = await List.findById(id);

    if (!list) continue;

    await List.findByIdAndDelete(id);
    await Item.deleteMany({ listId: id });

    revalidatePath(`/workspace/${list.workspaceId}`);
  }

  return { success: true };
}
