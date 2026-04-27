import { Item } from "@/models/Item";
import { unstable_cache } from "next/cache";
import { Types } from "mongoose";
import { mapItem } from "./mappers/item.mapper";
import { ItemDTO } from "@/types/dto/item.dto";
import { PopulatedItemtDB } from "@/types/db/items";

export const getItemsByList = (listId: string): Promise<ItemDTO[]> =>
  unstable_cache(
    async () => {
      if (!Types.ObjectId.isValid(listId)) {
        return [];
      }

      const items = await Item.find({
        listId: new Types.ObjectId(listId),
      })
        .populate("createdBy", "name email")
        .lean<PopulatedItemtDB[]>();

      return items.map(mapItem);
    },
    ["list-items", listId],
    {
      tags: [`list-${listId}`],
    },
  )();
