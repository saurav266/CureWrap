// models/orderSchema.js (or wherever this file is)

import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    addressLine1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,   // selected colour image
    size: String,    // 🔹 NEW: selected size (e.g. "L")
    color: String,   // 🔹 NEW: selected colour (e.g. "Black")
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false }, // optional if guest
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,

    paymentMethod: {
      type: String,
      enum: ["COD", "STRIPE", "RAZORPAY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentResult: { type: Object },

    subtotal: { type: Number, required: true },
    shippingCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    orderStatus: { type: String, default: "processing" },

    shiprocket: {
      order_id: { type: Number },
      channel_order_id: { type: String },
      shipment_id: { type: Number },
      status: { type: String },
      awb_code: { type: String },
      courier_company_id: { type: String },
      courier_name: { type: String },
      label_url: { type: String },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
