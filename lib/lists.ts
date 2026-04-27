import { List } from "@/models/List";
import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
import { mapList } from "./mappers/list.mapper";
import type { PopulatedListDB } from "@/types/db/list";
import { ListDTO } from "@/types/dto/list.dto";

export const getListsByWorkspace = (workspaceId: string): Promise<ListDTO[]> =>
  unstable_cache(
    async () => {
      if (!Types.ObjectId.isValid(workspaceId)) {
        return [];
      }

      const lists = await List.find({
        workspaceId: new Types.ObjectId(workspaceId),
      })
        .populate("createdBy", "name email")
        .lean<PopulatedListDB[]>();

      return lists.map(mapList);
    },
    ["workspace-lists", workspaceId],
    {
      tags: [`workspace-${workspaceId}`],
    },
  )();

export async function getListById(id: string): Promise<ListDTO | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const list = await List.findById(id)
    .populate("createdBy", "name email")
    .lean<PopulatedListDB | null>();

  return list ? mapList(list) : null;
}
