import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  method: { 
    type: String, 
    enum: ["card", "upi", "netbanking", "wallet", "cod"], 
    required: true 
  },

  status: { 
    type: String, 
    enum: ["pending", "success", "failed", "refunded"], 
    default: "pending" 
  },

  transaction_id: { type: String, unique: true }, // from gateway
  provider: { type: String }, // e.g. Razorpay, Stripe, PayPal

  // audit trail
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;