// models/orderSchema.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
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
    image: String,
    size: String,
    color: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false }, // allow guest
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,

    paymentMethod: {
      type: String,
      enum: ["COD", "STRIPE", "RAZORPAY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending","cod_collected", "paid", "failed", "refunded"], // 🔁 added refunded
      default: "pending",
    },
    paymentResult: { type: Object },

    subtotal: { type: Number, required: true },
    shippingCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "processing",
    },

    // used for return window calculation
    deliveredAt: { type: Date },

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

    /* 🔁 RETURN + REPLACEMENT FIELDS */

// none → requested → processing → approved → completed
//                      ↓
//                   rejected
returnStatus: {
  type: String,
  enum: ["none", "requested", "processing", "approved", "rejected", "completed"],
  default: "none",
},

// refund | replacement
returnType: {
  type: String,
  enum: ["refund", "replacement"],
},

returnReason: String,

returnRequestedAt: Date,
returnApprovedAt: Date,
returnResolvedAt: Date,

returnAdminNote: String,

// 🔁 Refund info (Razorpay)
refundInfo: {
  gateway: { type: String, default: "razorpay" },
  paymentId: String,
  refundId: String,
  amount: Number,
  status: String, // created | processed | failed
  raw: Object,
},

// 🔁 COD Refund destination (UPI / Bank)
refundDetails: {
  method: {
    type: String,
    enum: ["UPI", "BANK"],
  },

  // UPI refund
  upiId: String,

  // Bank refund
  accountHolder: String,
  accountNumber: String,
  ifsc: String,

  // Razorpay Fund Account (created once)
  fundAccountId: String,
},

// 🔁 Replacement order linkage
replacementOrderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order",
},

// 🔁 Shiprocket return pickup
returnPickup: {
  awb: String,
  courier: String,
  status: String, // pickup_scheduled | picked | delivered
},

  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
