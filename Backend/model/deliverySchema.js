import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  // Delivery address
  address: {
    street: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }, // postal code
    country: { type: String, default: "India" }
  },

  delivery_status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending"
  },

  expected_delivery: { type: Date },
  delivered_at: { type: Date }
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", DeliverySchema);
export default Delivery;