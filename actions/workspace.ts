"use server";
import { connectDB } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { Workspace } from "@/models/Workspace";
import { getCurrentUser } from "@/lib/auth";
import { getUserRole, getWorkspaceById } from "@/lib/workspace";
import { Item } from "@/models/Item";
import { List } from "@/models/List";
import type { WorkspaceMemberDB } from "@/types/db/workspace";
import { WorkspaceFormState } from "@/components/Workspace-settings/WorkspaceSettingsForm";
import { Role } from "@/types/workspace";

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
    ownerId: user.id,
    members: [{ userId: user.id, role: "owner" }],
  });

  revalidatePath("/workspace");
  return { success: true };
}

export async function deleteWorkspaces(ids: string[]) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  for (const id of ids) {
    const workspace = await getWorkspaceById(id);
    if (!workspace) continue;

    const role = getUserRole(workspace, user.id.toString());
    if (role !== "owner") {
      throw new Error("Forbitten");
    }
    const lists = await List.find({ workspaceId: id });
    for (const list of lists) {
      await Item.deleteMany({ listId: list._id });
    }

    await List.deleteMany({ workspaceId: id });
    await Workspace.findByIdAndDelete(id);
  }
  revalidateTag(`user-workspaces-${user.id.toString()}`, "max");
  revalidatePath("/workspace");
  return { success: true };
}
export async function deleteWorkspace(workspaceId: string) {
  return await deleteWorkspaces([workspaceId]);
}

export async function updateWorkspace(
  workspaceId: string,
  prevState: WorkspaceFormState,
  formData: FormData,
): Promise<WorkspaceFormState> {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        message: "",
      };
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return {
        success: false,
        error: "Workspace not found",
        message: "",
      };
    }

    const role = getUserRole(workspace, user.id.toString());

    if (!role || !["owner", "admin"].includes(role)) {
      return {
        success: false,
        error: "Forbidden",
        message: "",
      };
    }

    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString().trim();

    if (!name) {
      return {
        success: false,
        error: "Workspace name is required",
        message: "",
      };
    }

    const workspaceModel = await Workspace.findById(workspaceId);
    if (!workspaceModel) {
      return {
        success: false,
        error: "Workspace not found",
        message: "",
      };
    }

    workspaceModel.name = name;
    workspaceModel.description = description || "";

    await workspaceModel.save();

    revalidateTag(`workspace-${workspaceId}`, "max");
    revalidateTag(`user-workspaces-${user.id.toString()}`, "max");

    return {
      success: true,
      error: "",
      message: "Workspace updated successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to update workspace",
      message: "",
    };
  }
}

export async function updateMemberRole(
  workspaceId: string,
  memberUserId: string,
  role: Role,
) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const currentMember = workspace.members.find(
    (m: WorkspaceMemberDB) => m.userId.toString() === user.id.toString(),
  );
  if (!currentMember) throw new Error("Forbidden");

  const currentRole = currentMember.role;

  if (currentRole !== "owner" && currentRole !== "admin") {
    throw new Error("Forbidden");
  }

  const targetMember = workspace.members.find(
    (m: WorkspaceMemberDB) => m.userId.toString() === memberUserId,
  );
  if (!targetMember) throw new Error("Member not found");

  if (targetMember.role === "owner" && currentRole !== "owner") {
    throw new Error("Cannot change owner role");
  }

  if (role === "owner" && currentRole !== "owner") {
    throw new Error("Only owner can assign owner role");
  }

  targetMember.role = role;
  await workspace.save();

  revalidateTag(`workspace-${workspaceId}`, "max");
  revalidateTag(`user-workspaces-${memberUserId}`, "max");

  return { success: true };
}

export async function removeWorkspaceMember(
  workspaceId: string,
  memberUserId: string,
) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const currentMember = workspace.members.find(
    (m: WorkspaceMemberDB) => m.userId.toString() === user.id.toString(),
  );
  if (!currentMember) throw new Error("Forbidden");

  const currentRole = currentMember.role;

  if (currentRole !== "owner" && currentRole !== "admin") {
    throw new Error("Forbidden");
  }

  const targetMember = workspace.members.find(
    (m: WorkspaceMemberDB) => m.userId.toString() === memberUserId,
  );
  if (!targetMember) throw new Error("Member not found");

  if (targetMember.role === "owner") {
    throw new Error("Cannot remove owner");
  }

  workspace.members = workspace.members.filter(
    (m: WorkspaceMemberDB) => m.userId.toString() !== memberUserId,
  );

  await workspace.save();

  revalidateTag(`workspace-${workspaceId}`, "max");
  revalidateTag(`user-workspaces-${memberUserId}`, "max");

  return { success: true };
}
