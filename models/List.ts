import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
  },
  name: String,
});

export const List = mongoose.models.List || mongoose.model("List", ListSchema);
