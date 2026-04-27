import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { UserDTO } from "@/types/dto/user.dto";

export async function getCurrentUser(): Promise<UserDTO> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await User.findById(session.user.id).lean();

  if (!user) throw new Error("User not found");

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
