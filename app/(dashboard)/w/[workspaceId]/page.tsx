import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { User } from "@/models/User";
import { Workspace } from "@/models/Workspace";

interface Props {
  params: {
    workspaceId: string;
  };
}
export default async function WorkspacePage({ params }: Props) {
  await connectDB();

  const session = await getServerSession();
  if (!session?.user?.email) {
    return notFound();
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return notFound();
  }

  if (!Types.ObjectId.isValid(params.workspaceId)) {
    return notFound();
  }

  const workspace = await Workspace.findById(params.workspaceId).lean();
  if (!workspace) {
    return notFound();
  }

  const isMember = workspace.members.some(
    (m: any) => m.userId.toString() === user._id.toString(),
  );
  if (!isMember) {
    return notFound();
  }

  const member = workspace.members.find(
    (m: any) => m.userId.toString() === user._id.toString(),
  );
  const role = member?.role;
  return (
    <div>
      <h1>{workspace.name}</h1>
      <p>{workspace.description}</p>
    </div>
  );
}
