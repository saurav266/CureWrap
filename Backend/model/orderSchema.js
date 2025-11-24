// models/Order.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: Number,
  image: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // optional if guest
  items: [OrderItemSchema],
  shippingAddress: AddressSchema,
  paymentMethod: { type: String, enum: ["COD", "STRIPE", "RAZORPAY"], required: true },
  paymentStatus: { type: String, enum: ["pending","paid","failed"], default: "pending" },
  paymentResult: { type: Object }, // capture response from gateway
  subtotal: { type: Number, required: true },
  shippingCharges: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  orderStatus: { type: String, default: "processing" }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
