import { connectDB } from "@/lib/db";
import { Invite } from "@/models/Invite";
import { Workspace } from "@/models/Workspace";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

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

  await Workspace.findByIdAndUpdate(invite.workspaceId, {
    $addToSet: {
      members: {
        userId: user._id,
        role: "member",
      },
    },
  });

  invite.uses = (invite.uses || 0) + 1;

  await invite.save();

  return redirect(`/workspace/${invite.workspaceId}`);
}
