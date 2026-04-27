export interface ItemDTO {
  id: string;
  name: string;
  note?: string;
  isDone: boolean;
  listId: string;

  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  createdAt: string;
}
