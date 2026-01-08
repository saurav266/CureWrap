import mongoose from "mongoose";

/* ================= ADDRESS ================= */
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

/* ================= ORDER ITEM ================= */
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

/* ================= RETURN HISTORY (NEW) ================= */
const ReturnHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "cancelled_by_user",
        "completed",
      ],
    },
    by: {
      type: String, // user | admin | system
    },
    note: String,
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ================= MAIN ORDER ================= */
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String }, // allow guest

    items: [OrderItemSchema],
    shippingAddress: AddressSchema,

    /* ================= PAYMENT ================= */
    paymentMethod: {
      type: String,
      enum: ["COD", "STRIPE", "RAZORPAY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentResult: Object,

    subtotal: Number,
    shippingCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number,

    /* ================= ORDER STATUS ================= */
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

    deliveredAt: Date,

    /* ================= SHIPROCKET ================= */
    shiprocket: {
      order_id: Number,
      channel_order_id: String,
      shipment_id: Number,
      status: String,
      awb_code: String,
      courier_company_id: String,
      courier_name: String,
      label_url: String,

      // 🔁 Reverse pickup (NEW – optional)
      reverse_pickup_id: String,
    },

    /* ================= RETURN / REPLACEMENT ================= */
    returnStatus: {
      type: String,
      enum: [
        "none",        // default
        "requested",   // user submitted
        "approved",    // admin approved
        "rejected",    // admin rejected
        "completed",   // refund/replacement done
      ],
      default: "none",
    },

    returnType: {
      type: String,
      enum: ["refund", "replacement", null],
      default: null,
    },

    returnReason: String,
    returnRequestedAt: Date,
    returnResolvedAt: Date,
    returnAdminNote: String,

    // 🔁 Return lifecycle log (NEW)
    returnHistory: [ReturnHistorySchema],

    /* ================= REFUND INFO ================= */
    refundInfo: {
      gateway: String,
      refundId: String,
      amount: Number,
      currency: String,
      status: String,
      raw: Object,
    },

    /* ================= REPLACEMENT LINK ================= */
    replacementOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
