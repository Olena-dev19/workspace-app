import type { UserDB } from "@/types/db/user";
import type { UserDTO } from "@/types/dto/user.dto";

export function mapUser(user: UserDB): UserDTO {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
