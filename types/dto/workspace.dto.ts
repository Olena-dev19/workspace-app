export type Role = "owner" | "admin" | "member";

export interface WorkspaceMemberDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: Role;
}

export interface WorkspaceDTO {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMemberDTO[];
}
