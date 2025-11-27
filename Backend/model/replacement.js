import mongoose from "mongoose";

const ReplacementSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // which item requested for replacement
    item: {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      size: String,
      color: String,
      quantity: Number,
    },

    reason: { type: String, required: true },
    images: [String], // Cloudinary image URLs
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "pickup_scheduled", "picked", "reshipped", "completed"],
      default: "pending"
    },

    admin_notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Replacement", ReplacementSchema);
