import { Types } from "mongoose";

export interface PopulatedUserDB {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ListDB {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  workspaceId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedListDB extends Omit<ListDB, "createdBy"> {
  createdBy: PopulatedUserDB;
}
