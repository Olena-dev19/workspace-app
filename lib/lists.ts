import { unstable_cache } from "next/cache";
import { List } from "@/models/List";
import { ListType } from "@/models/List";
import { Types } from "mongoose";

export const getListsByWorkspace = unstable_cache(
  async (workspaceId: string) => {
    return List.find({
      workspaceId: new Types.ObjectId(workspaceId),
    }).lean<ListType[]>();
  },
  ["lists"],
  {
    tags: ["lists"],
  },
);
