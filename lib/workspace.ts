import { Workspace } from "@/models/Workspace";
import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
import { WorkspaceType } from "@/types/workspace";

export function getWorkspaceById(id: string) {
  return unstable_cache(
    async () => {
      if (!Types.ObjectId.isValid(id)) return null;

      return Workspace.findById(id)
        .populate("members.userId", "name email")
        .lean();
    },
    ["workspace", id],
    {
      tags: [`workspace-${id}`],
    },
  )();
}

export async function isWorkspaceMember(workspace: any, userId: string) {
  return workspace.members.some(
    (member: any) => member.userId?._id?.toString() === userId.toString(),
  );
}

export async function getUserRole(workspace: any, userId: string) {
  const member = workspace.members.find(
    (member: any) => member.userId?._id?.toString() === userId.toString(),
  );

  return member?.role;
}

export async function getUserWorkspaces(userId: string) {
  return Workspace.find({
    "members.userId": new Types.ObjectId(userId),
  }).lean();
}
