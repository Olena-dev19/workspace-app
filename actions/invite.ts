"use server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Invite } from "@/models/Invite";
import { getUserRole, getWorkspaceById } from "@/lib/workspace";
import crypto from "crypto";
import { Workspace } from "@/models/Workspace";
import { Types } from "mongoose";

export async function createInvite(workspaceId: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  const role = getUserRole(workspace, user.id.toString());

  if (role !== "owner" && role !== "admin") {
    throw new Error("Forbidden");
  }

  const token = crypto.randomBytes(24).toString("hex");

  await Invite.create({
    token,
    workspaceId,
    createdBy: user.id,
    maxUses: 10,
  });

  return {
    link: `${process.env.NEXTAUTH_URL}/invite/${token}`,
  };
}

export async function acceptInvite(token: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const invite = await Invite.findOne({ token });

  if (!invite) {
    throw new Error("Invalid invite");
  }
  if (invite.maxUses && (invite.uses ?? 0) >= invite.maxUses) {
    throw new Error("Invite expired");
  }

  if (invite.maxUses && invite.uses >= invite.maxUses) {
    await invite.deleteOne();
  }

  const workspace = await Workspace.findById(invite.workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.userId.toString() === user.id,
  );

  if (!alreadyMember) {
    workspace.members.push({
      userId: new Types.ObjectId(user.id),
      role: "member",
    });

    invite.uses = (invite.uses ?? 0) + 1;

    await Promise.all([workspace.save(), invite.save()]);
  }

  return {
    workspaceId: workspace._id.toString(),
    added: !alreadyMember,
    userId: user.id,
  };
}
