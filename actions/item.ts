"use server";

import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getListById } from "@/lib/lists";
import { getWorkspaceById } from "@/lib/workspace";
import { Item } from "@/models/Item";
import { revalidateTag, revalidatePath } from "next/cache";

import { isWorkspaceMember } from "@/lib/workspace";

export async function createItem(formData: FormData) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const listId = formData.get("listId")?.toString();

  const list = await getListById(listId);
  if (!list) throw new Error("List not found");

  if (!name || !listId) throw new Error('("Missing fields"');

  await Item.create({
    name,
    listId,
    createdBy: user._id,
  });

  revalidatePath(`/workspace/${list.workspaceId}/lists/${listId}`);
}

export async function toggleItem(id: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await Item.findById(id);
  if (!item) throw new Error("Item not found");

  const list = await getListById(item.listId.toString());
  if (!list) throw new Error("List not found");

  const workspace = await getWorkspaceById(list.workspaceId.toString());
  if (!workspace) throw new Error("Workspace not found");

  const isMember = await isWorkspaceMember(workspace, user._id.toString());
  if (!isMember) throw new Error("Forbidden");

  item.isDone = !item.isDone;
  await item.save();

  revalidatePath(`/workspace/${list.workspaceId}/lists/${item.listId}`);
}

export async function deleteItem(id: string) {
  await connectDB();
  const item = await Item.findById(id);
  if (!item) return;

  const list = await getListById(item.listId.toString());
  if (!list) throw new Error("List not found");

  const workspace = await getWorkspaceById(list.workspaceId.toString());
  if (!workspace) throw new Error("Workspace not found");

  await Item.findByIdAndDelete(id);
  revalidatePath(`/workspace/${list.workspaceId}/lists/${item.listId}`);
}
export async function updateItem(
  itemId: string,
  data: { name?: string; note?: string },
) {
  await connectDB();
  const updated = await Item.findByIdAndUpdate(
    itemId,
    { ...data },
    { new: true },
  );
  if (!updated) throw new Error("Item not found");
  revalidateTag(`list-${updated.listId}`, "max");
  return { succcess: true };
}
