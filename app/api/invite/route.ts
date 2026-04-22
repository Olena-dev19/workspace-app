import { connectDB } from "@/lib/db";
import { Invite } from "@/models/Invite";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId } = await req.json();

  const token = crypto.randomBytes(24).toString("hex");

  await Invite.create({
    workspaceId,
    token,
    uses: 0,
  });

  const link = `${process.env.NEXTAUTH_URL}/invite/${token}`;

  return Response.json({ link });
}
