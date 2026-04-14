import { Types } from "mongoose";

export type Role = "owner" | "admin" | "member";

export interface WorkspaceMember {
  userId: Types.ObjectId;
  role: Role;
}

export interface WorkspaceType {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: WorkspaceMember[];
}
