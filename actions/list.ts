"use server";
import { connectDB } from "@/lib/db";
import { isWorkspaceMember } from "@/lib/workspace";
import { getCurrentUser } from "@/lib/auth";
import { getWorkspaceById } from "@/lib/workspace";
import { revalidateTag } from "next/cache";
import { List } from "@/models/List";

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

  const isMember = isWorkspaceMember(workspace, user._id.toString());
  if (!isMember) throw new Error("You are not a member of this workspace");

  await List.create({
    name,
    workspaceId,
    description,
    creatorId: user._id,
  });

  revalidateTag(`workspace-${workspaceId}`, "max");
  return { success: true };
}
