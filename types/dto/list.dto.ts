export interface ListDTO {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;

  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}
