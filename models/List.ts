import mongoose, { Schema, Types, Model } from "mongoose";

export interface ListType {
  _id: string;
  workspaceId: Types.ObjectId;
  name: string;
  description?: string;
  timestamps: Date;
  creatorId: Types.ObjectId;
}

const ListSchema = new Schema<ListType>({
  name: { type: String, required: true },
  description: String,
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamps: { type: Date, default: Date.now },
});

export const List: Model<ListType> =
  mongoose.models.List || mongoose.model<ListType>("List", ListSchema);
