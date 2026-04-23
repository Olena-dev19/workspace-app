"use server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Invite } from "@/models/Invite";
import { getWorkspaceById, getUserRole } from "@/lib/workspace";
import crypto from "crypto";
import { Workspace } from "@/models/Workspace";

export async function createInvite(workspaceId: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const role = await getUserRole(workspace, user._id.toString());

  if (role !== "owner" && role !== "admin") {
    throw new Error("Forbidden");
  }

  const token = crypto.randomBytes(24).toString("hex");

  await Invite.create({
    token,
    workspaceId,
    createdBy: user._id,
    maxUses: 10,
  });

  return {
    link: `${process.env.NEXTAUTH_URL}/invite/${token}`,
  };
}
