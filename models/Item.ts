import mongoose, { Schema, Types, Model } from "mongoose";
export interface ItemType {
  _id: Types.ObjectId;

  name: string;
  listId: Types.ObjectId;
  createdBy: Types.ObjectId;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: Types.ObjectId;
  note: string;
}

const ItemSchema = new Schema<ItemType>(
  {
    name: { type: String, required: true },
    listId: { type: Types.ObjectId, ref: "List", required: true },
    isDone: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, required: true, ref: "User" },
    assignedTo: Types.ObjectId,
    note: { type: String },
  },
  { timestamps: true },
);

export const Item: Model<ItemType> =
  mongoose.models.Item || mongoose.model<ItemType>("Item", ItemSchema);
