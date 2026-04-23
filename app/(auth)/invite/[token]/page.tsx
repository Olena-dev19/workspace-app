import { connectDB } from "@/lib/db";
import { Invite } from "@/models/Invite";
import { Workspace } from "@/models/Workspace";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export default async function InvitePage({ params }: any) {
  await connectDB();
  const { token } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return redirect(`/sign-in?callbackUrl=/invite/${token}`);
  }

  const invite = await Invite.findOne({ token: token });

  if (!invite) {
    return <div>Invalid invite</div>;
  }

  if (invite.maxUses && (invite.uses || 0) >= invite.maxUses) {
    return <div>Invite expired</div>;
  }

  const workspace = await Workspace.findById(invite.workspaceId);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const alreadyMember = workspace.members.some(
    (m: any) => m.userId.toString() === user._id.toString(),
  );

  if (alreadyMember) {
    return redirect(`/workspace/${invite.workspaceId}`);
  }

  workspace.members.push({
    userId: user._id,
    role: "member",
  });

  await workspace.save();
  revalidateTag(`workspace-${invite.workspaceId.toString()}`, "max");
  return redirect(`/workspace/${invite.workspaceId}`);
}
