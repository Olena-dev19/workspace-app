import { Workspace } from "@/models/Workspace";
import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
import { WorkspaceType } from "@/types/workspace";

export async function getWorkspaceById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return Workspace.findById(id).lean();
}

export async function isWorkspaceMember(workspace: any, userId: string) {
  return workspace.members.some(
    (member: any) => member.userId.toString() === userId.toString(),
  );
}

export async function getUserRole(workspace: any, userId: string) {
  const member = workspace.members.find(
    (member: any) => member.userId.toString() === userId.toString(),
  );
  return member?.role;
}

export const getUserWorkspaces = unstable_cache(
  async (userId: string) => {
    return Workspace.find({
      "members.userId": new Types.ObjectId(userId),
    }).lean<WorkspaceType[]>();
  },
  ["workspaces"],
  { tags: ["workspaces"] },
);
