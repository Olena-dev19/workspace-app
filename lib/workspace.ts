import { Workspace } from "@/models/Workspace";
import { Types } from "mongoose";
import { unstable_cache } from "next/cache";

import { WorkspaceDB } from "@/types/db/workspace";
import { mapWorkspace } from "./mappers/workspace.mapper";
import { WorkspaceDTO } from "@/types/dto/workspace.dto";
import { Role } from "@/types/workspace";

export async function getWorkspaceById(
  id: string,
): Promise<WorkspaceDTO | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return unstable_cache(
    async () => {
      const workspace = await Workspace.findById(id)
        .populate("members.userId", "name email")
        .lean<WorkspaceDB>();

      return workspace ? mapWorkspace(workspace) : null;
    },
    ["workspace", id],
    {
      tags: [`workspace-${id}`],
    },
  )();
}

export function isWorkspaceMember(
  workspace: WorkspaceDTO,
  userId: string,
): boolean {
  return workspace.members.some((member) => member.user.id === userId);
}

export function getUserRole(
  workspace: WorkspaceDTO,
  userId: string,
): Role | null {
  return (
    workspace.members.find((member) => member.user.id === userId)?.role ?? null
  );
}

export const getUserWorkspaces = async (userId: string) => {
  return unstable_cache(
    async () => {
      const workspaces = await Workspace.find({
        "members.userId": new Types.ObjectId(userId),
      }).lean<WorkspaceDB[]>();

      return workspaces.map(mapWorkspace);
    },
    ["user-workspaces", userId],
    { tags: [`user-workspaces-${userId}`] },
  )();
};
