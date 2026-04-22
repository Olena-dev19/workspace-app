import mongoose, { Schema, Types, Model } from "mongoose";

export interface ListType {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  workspaceId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  tasksCount: number;
  completedCount: number;
}

const ListSchema = new Schema<ListType>(
  {
    name: { type: String, required: true },
    description: String,
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasksCount: Number,
    completedCount: Number,
  },
  { timestamps: true },
);

export const List: Model<ListType> =
  mongoose.models.List || mongoose.model<ListType>("List", ListSchema);
