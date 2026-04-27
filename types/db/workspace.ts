import { Types } from "mongoose";

export type Role = "owner" | "admin" | "member";

export interface WorkspaceMemberDB {
  userId:
    | Types.ObjectId
    | {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
  role: Role;
}

export interface WorkspaceDB {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: WorkspaceMemberDB[];
  createdAt: Date;
  updatedAt: Date;
}
