import { cache } from "react";
import { Workspace } from "@/models/Workspace";
import { List } from "@/models/List";
import { Types } from "mongoose";

export const getWorkspaceCached = cache(async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return Workspace.findById(id).lean();
});

export const getListCached = cache(async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return List.findById(id).lean();
});
