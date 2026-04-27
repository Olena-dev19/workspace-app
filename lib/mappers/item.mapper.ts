import { PopulatedItemtDB } from "@/types/db/items";
import { ItemDTO } from "@/types/dto/item.dto";

export function mapItem(item: PopulatedItemtDB): ItemDTO {
  return {
    id: item._id.toString(),
    name: item.name,
    note: item.note ?? "",
    isDone: item.isDone,
    listId: item.listId.toString(),
    createdBy: {
      id: item.createdBy._id.toString(),
      name: item.createdBy.name,
      email: item.createdBy.email,
    },
    createdAt: item.createdAt.toISOString(),
  };
}
