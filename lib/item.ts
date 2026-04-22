import { Item } from "@/models/Item";
import { unstable_cache } from "next/cache";
import { Types } from "mongoose";

export function getItemsByList(listId: string) {
  return unstable_cache(
    async () => {
      return Item.find({
        listId: new Types.ObjectId(listId),
      })
        .populate("createdBy", "name email")
        .lean();
    },
    ["items", listId],
    {
      tags: [`list-${listId}`],
    },
  )();
}
