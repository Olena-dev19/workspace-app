import { ListDTO } from "@/types/dto/list.dto";
import { PopulatedListDB } from "@/types/db/list";

export function mapList(list: PopulatedListDB): ListDTO {
  return {
    id: list._id.toString(),
    name: list.name,
    description: list.description ?? "",
    workspaceId: list.workspaceId.toString(),

    createdBy: {
      id: list.createdBy._id.toString(),
      name: list.createdBy.name,
      email: list.createdBy.email,
    },

    createdAt: list.createdAt.toISOString(),
    updatedAt: list.updatedAt.toISOString(),
  };
}
