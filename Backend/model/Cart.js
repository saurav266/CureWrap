// models/Cart.js
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  priceAtAdd: { type: Number, required: true } // snapshot
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [CartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
