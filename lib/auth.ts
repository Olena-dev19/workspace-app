import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession();

  if (!session?.user?.email) return null;
  const user = await User.findOne({ email: session.user.email });
  return user;
}
