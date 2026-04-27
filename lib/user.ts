import { unstable_cache } from "next/cache";
import { User } from "@/models/User";
import { mapUser } from "@/lib/mappers/user.mapper";
import type { UserDB } from "@/types/db/user";
import type { UserDTO } from "@/types/dto/user.dto";

export const getUserCached = async (userId: string): Promise<UserDTO | null> =>
  unstable_cache(
    async () => {
      const user = await User.findById(userId).lean<UserDB>();
      return user ? mapUser(user) : null;
    },
    ["user", userId],
    {
      tags: [`user-${userId}`],
    },
  )();
