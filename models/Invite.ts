import mongoose, { Schema, Types, Model } from "mongoose";

export interface InviteType {
  _id: Types.ObjectId;
  token: string;
  workspaceId: Types.ObjectId;
  createdBy: Types.ObjectId;
  expiresAt?: Date;
  uses: number;
  maxUses?: number;
}

const InviteSchema = new Schema<InviteType>(
  {
    token: { type: String, required: true, unique: true },
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
    expiresAt: Date,
    uses: { type: Number, default: 0 },
    maxUses: { type: Number, default: 10 }, // MVP: 10 використань
  },
  { timestamps: true },
);

export const Invite: Model<InviteType> =
  mongoose.models.Invite || mongoose.model<InviteType>("Invite", InviteSchema);
