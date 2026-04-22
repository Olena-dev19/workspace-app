import { getCurrentUser } from "@/lib/auth";
import { getWorkspaceById, isWorkspaceMember } from "@/lib/workspace";

export async function requireWorkspaceAccess(workspaceId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = isWorkspaceMember(workspace, user._id.toString());

  if (!isMember) {
    throw new Error("Forbidden");
  }

  return { user, workspace };
}
