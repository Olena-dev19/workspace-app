import { Types } from "mongoose";
export interface PopulatedUserDB {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ItemDB {
  _id: Types.ObjectId;
  name: string;
  note?: string;
  listId: Types.ObjectId;
  createdBy: Types.ObjectId;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface PopulatedItemtDB extends Omit<ItemDB, "createdBy"> {
  createdBy: PopulatedUserDB;
}
