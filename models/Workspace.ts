import mongoose, { Schema, Types, Model } from "mongoose";
import { WorkspaceType } from "../types/workspace";

const WorkspaceSchema = new Schema<WorkspaceType>({
  name: { type: String, required: true },
  description: String,
  ownerId: { type: Types.ObjectId, ref: "User" },
  members: [
    {
      userId: { type: Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["owner", "admin", "member"] },
    },
  ],
});

export const Workspace: Model<WorkspaceType> =
  mongoose.models.Workspace ||
  mongoose.model<WorkspaceType>("Workspace", WorkspaceSchema);
