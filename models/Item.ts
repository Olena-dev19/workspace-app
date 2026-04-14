import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  listId: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
  title: String,
  status: { type: String, enum: ["open", "done"], default: "open" },
});

export const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
