import { Types } from "mongoose";

export interface PopulatedUser {
  _id: Types.ObjectId;
  name?: string;
  email: string;
}

export interface ListPopulated {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  workspaceId: Types.ObjectId;
  createdBy: PopulatedUser;
  createdAt: Date;
  updatedAt: Date;
  tasksCount: number;
  completedCount: number;
}
