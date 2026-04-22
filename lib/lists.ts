import { List } from "@/models/List";
import { Types } from "mongoose";
import { unstable_cache } from "next/cache";

export const getListsByWorkspace = (workspaceId: string) =>
  unstable_cache(
    async () => {
      return List.find({
        workspaceId: new Types.ObjectId(workspaceId),
      })
        .populate("createdBy", "name email")
        .lean();
    },
    [`workspace-${workspaceId}`],
    {
      tags: [`workspace-${workspaceId}`],
    },
  )();

export async function getListById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return List.findById(id).lean();
}
