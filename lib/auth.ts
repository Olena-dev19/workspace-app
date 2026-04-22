import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;
  const user = await User.findById(session.user.id);
  return user;
}
