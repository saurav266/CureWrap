
// controller/orderController.js
import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../model/orderSchema.js";
import { io } from "../server.js";
import {
  createShiprocketOrder,
  assignShiprocketAwb,
  generateShiprocketLabel,
  trackShipmentByAwb,
  trackShipment,
  cancelShiprocketOrder,
  shiprocketAuth,
} from "../services/shiprocketService.js";

import shipRocketStatusMap from "../utilis/shipRocketStatusMap.js"

const RETURN_WINDOW_DAYS = 7; // backend return window

// Razorpay client (for payments + refunds)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Place Order (Guest + Logged-in)
 */
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCharges = 0,
      tax = 0,
      total,
      paymentResult,
      userId,
    } = req.body;

    if (!items || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "No items in order" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    if (subtotal == null || total == null) {
      return res
        .status(400)
        .json({ error: "Subtotal and total are required" });
    }

    // NORMALIZE ITEMS
    const normalizedItems = items.map((i, idx) => {
      const productId = i.productId || i.product || i._id || i.id;

      if (!productId) {
        console.warn(`Item at index ${idx} has no productId/product/_id/id`, i);
      }

      const name =
        i.name || i.productName || i.title || `Item ${idx + 1}`;

      return {
        product: productId,
        name,
        price: i.price ?? i.sale_price ?? 0,
        quantity: i.quantity ?? 1,
        image: i.image || null,
        size: i.size || i.selectedSize || null,
        color: i.color || i.selectedColor || null,
      };
    });

    // PINCODE VALIDATION
    const rawPincode = String(shippingAddress.postalCode || "").trim();
    if (!/^[1-9][0-9]{5}$/.test(rawPincode)) {
      return res.status(400).json({
        error: "Please enter a valid 6-digit pincode (Indian PIN code).",
      });
    }

    // PAYMENT STATUS: always start pending
    let paymentStatus = "pending";
    const finalUserId = userId || req.user?.id || null;

    // CREATE ORDER
    const order = await Order.create({
      userId: finalUserId,
      items: normalizedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentResult: paymentResult || null,
      subtotal,
      shippingCharges,
      tax,
      total,
      orderStatus: "processing",
      returnStatus: "none",
    });

    // Emit new order to admin dashboard (realtime)
    try {
      io.emit("new-order", {
        _id: order._id,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      });
    } catch (emitErr) {
      console.error("Socket emit new-order failed:", emitErr);
    }

    // SHIPROCKET (COD ONLY HERE)
    let shiprocketData = null;
    let awbData = null;
    let labelData = null;

    try {
      if (paymentMethod === "COD") {
        // build payload
        const fullName = shippingAddress.name || "";
        const [firstName, ...restName] = fullName.split(" ");
        const lastName = restName.join(" ");

        const srPayload = {
          channel_order_id: `WEB-${order._id}`,
          customer_name: firstName || fullName || "Customer",
          customer_last_name: lastName || "",
          address: shippingAddress.addressLine1,
          city: shippingAddress.city,
          pincode: rawPincode,
          state: shippingAddress.state,
          country: shippingAddress.country || "India",
          email: paymentResult?.email || "noemail@example.com",
          phone: shippingAddress.phone,
          items: normalizedItems.map((i) => ({
            name: i.name,
            sku: (i.product || "").toString(),
            quantity: i.quantity,
            price: i.price,
          })),
          payment_method: "COD",
          total,
          length: 10,
          breadth: 10,
          height: 5,
          weight: 0.5,
        };

        // 1) create SR order
        shiprocketData = await createShiprocketOrder(srPayload);

        // Shiprocket may return shipment_id or order_id depending on response.
        const shipmentId =
          shiprocketData?.shipment_id ||
          shiprocketData?.data?.shipment_id ||
          shiprocketData?.response?.data?.shipment_id ||
          null;

        if (!shipmentId) {
          // If Shiprocket didn't return shipment id now, still save partial info and continue.
          console.warn("Shiprocket did not return shipment_id on create:", shiprocketData);
          // Save basic Shiprocket info (if any) so later processes can retry
          order.shiprocket = {
            order_id: shiprocketData?.order_id || shiprocketData?.data?.order_id || null,
            channel_order_id: shiprocketData?.channel_order_id || `WEB-${order._id}`,
            status: shiprocketData?.status || shiprocketData?.data?.status || "created",
          };
          await order.save();
        } else {
          // 2) assign AWB
          awbData = await assignShiprocketAwb(shipmentId);

          // Depending on SR response shape, pick awb and courier fields
          const awb_code =
            awbData?.awb_code ||
            awbData?.response?.data?.awb_code ||
            awbData?.response?.data?.data?.awb_code ||
            null;

          const courier_name =
            awbData?.courier_name ||
            awbData?.response?.data?.courier_name ||
            awbData?.response?.data?.data?.courier_name ||
            null;

          const courier_company_id =
            awbData?.courier_company_id ||
            awbData?.response?.data?.courier_company_id ||
            awbData?.response?.data?.data?.courier_company_id ||
            null;

          // 3) generate label (optional)
          try {
            labelData = await generateShiprocketLabel(shipmentId);
          } catch (labelErr) {
            console.warn("Label generation warning:", labelErr?.response?.data || labelErr.message);
          }

          // SAVE everything into order.shiprocket (important: save shipment_id)
          order.shiprocket = {
            order_id: shiprocketData?.order_id || shiprocketData?.data?.order_id || null,
            channel_order_id: shiprocketData?.channel_order_id || `WEB-${order._id}`,
            shipment_id: Number(shipmentId),
            status: shiprocketData?.status || "created",
            awb_code,
            courier_company_id,
            courier_name,
            label_url:
              labelData?.label_url ||
              (labelData?.label_url_list && labelData.label_url_list[0]) ||
              null,
          };

          await order.save();
        }
      }
    } catch (shipErr) {
      // log but don't fail the API - order has been created
      console.error("Shiprocket error:", shipErr?.response?.data || shipErr?.message || shipErr);
    }

    return res.json({
      success: true,
      order,
      shiprocket: shiprocketData,
      awb: awbData,
      label: labelData,
    });
  } catch (e) {
    console.error("placeOrder error:", e);
    res.status(500).json({ error: "Order failed" });
  }
};

// COD: mark as paid (manual admin)
export const markOrderPaid = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      if (order.orderStatus === "processing") {
        order.orderStatus = "shipped";
      }
      await order.save();
      io.emit("order-updated", { orderId: order._id, orderStatus: order.orderStatus });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("markOrderPaid error:", err);
    res.status(500).json({ error: "Failed to mark order as paid" });
  }
};

/* ========= 💳 COD → Razorpay Conversion ========= */

// Create Razorpay order for an existing COD order
export const createRazorpayOrderForCod = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (!order.total || order.total <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid order amount" });
    }

    const amountPaise = Math.round(order.total * 100); // Razorpay uses paise

    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: `COD-${order._id}`,
      notes: {
        appOrderId: order._id.toString(),
        type: "cod_to_online",
      },
    };

    const rpOrder = await razorpay.orders.create(options);

    // Store Razorpay order info in paymentResult
    order.paymentResult = {
      ...(order.paymentResult || {}),
      razorpay_order_id: rpOrder.id,
      status: "created",
      mode: "cod_to_razorpay",
    };

    await order.save();

    return res.json({
      success: true,
      razorpayOrder: rpOrder,
      appOrderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("createRazorpayOrderForCod error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay payment for COD order and mark it as paid
export const verifyRazorpayPaymentAndMarkPaid = async (req, res) => {
  try {
    const {
      appOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !appOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing Razorpay fields" });
    }

    const order = await Order.findById(appOrderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found" });
    }

    // Verify signature
    const signPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signPayload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Razorpay signature" });
    }

    // Signature valid => mark as paid
    order.paymentStatus = "paid";
    order.paymentMethod = "RAZORPAY";
    order.paymentResult = {
      ...(order.paymentResult || {}),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "paid",
    };

    if (order.orderStatus === "processing") {
      order.orderStatus = "shipped";
    }

    await order.save();
    io.emit("order-updated", { orderId: order._id, orderStatus: order.orderStatus });

    return res.json({ success: true, order });
  } catch (err) {
    console.error("verifyRazorpayPaymentAndMarkPaid error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to verify payment / mark order as paid",
    });
  }
};

/* ========= ORDERS CRUD / LISTING ========= */

export const getAllOrders = async (req, res) => {
  try {
    const { filter, limit: limitStr } = req.query;

    const query = {};

    // REMOVE FAILED ORDERS ALWAYS
    query.paymentStatus = { $ne: "failed" };

    if (filter === "cancelled") {
      query.orderStatus = "cancelled";
    } 
    else if (filter === "prepaid") {
      query.paymentStatus = "paid";
      query.paymentMethod = { $ne: "COD" };
    } 
    else if (filter === "cod") {
      query.paymentMethod = "COD";
    }

    // limit support for dashboard
    const limit = limitStr ? parseInt(limitStr, 10) : null;

    let mongooseQuery = Order.find(query).sort({ createdAt: -1 });
    if (limit > 0) mongooseQuery = mongooseQuery.limit(limit);

    const orders = await mongooseQuery;

    return res.json({ success: true, orders });

  } catch (e) {
    console.error("getAllOrders error:", e);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (e) {
    console.error("getOrderById error:", e);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) {
    console.error("getUserOrders error:", e);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};



// ✅ UPDATED: auto-refund on cancel for Razorpay-paid orders (when status update endpoint used)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
      "processing",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const previousStatus = order.orderStatus;

    // set new status
    order.orderStatus = status;

    // set deliveredAt when delivered
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    /**
     * 🔁 AUTO REFUND LOGIC
     * If:
     *  - status changed to "cancelled"
     *  - order was previously not cancelled
     *  - paymentMethod is RAZORPAY
     *  - paymentStatus is "paid"
     * then try to refund via Razorpay.
     */
    if (
      status === "cancelled" &&
      previousStatus !== "cancelled" &&
      order.paymentMethod === "RAZORPAY" &&
      order.paymentStatus === "paid"
    ) {
      try {
        const paymentId = order.paymentResult?.razorpay_payment_id;

        if (!paymentId) {
          throw new Error("Missing razorpay_payment_id on order");
        }

        const refundAmountPaise = Math.round(order.total * 100);

        const refund = await razorpay.payments.refund(paymentId, {
          amount: refundAmountPaise, // full refund
          speed: "optimum",
        });

        // mark order as refunded
        order.paymentStatus = "refunded";
        order.refundInfo = {
          gateway: "razorpay",
          refundId: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          createdAt: new Date(),
          raw: refund,
        };

        console.log(
          `✅ Auto refund success for order ${order._id}, refundId = ${refund.id}`
        );
      } catch (refundErr) {
        console.error("❌ Auto refund on cancel failed:", refundErr);

        // keep order cancelled, but store refund failure info
        order.refundInfo = {
          gateway: "razorpay",
          refundId: null,
          amount: order.total,
          currency: "INR",
          status: "failed",
          error: refundErr.message,
        };
      }
    }

    await order.save();
    io.emit("order-updated", { orderId: order._id, orderStatus: order.orderStatus });
    res.json({ success: true, order });
  } catch (e) {
    console.error("updateOrderStatus error:", e);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (e) {
    console.error("deleteOrder error:", e);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    console.log("Contact form submitted:", { name, email, message });
    res.json({
      success: true,
      message: "Message received. We'll get back to you soon!",
    });
  } catch (e) {
    console.error("contact error:", e);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};

export const editOrder = async (req, res) => {
  try {
    const orderId = req.params.id.trim();
    const updates = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (updates.shippingAddress && typeof updates.shippingAddress === "object") {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...updates.shippingAddress,
      };
      delete updates.shippingAddress;
    }

    Object.keys(updates).forEach((key) => {
      order[key] = updates[key];
    });

    await order.save();
    io.emit("order-updated", { orderId: order._id, orderStatus: order.orderStatus });
    res.json({ success: true, order });
  } catch (e) {
    console.error("editOrder error:", e);
    res.status(500).json({ error: "Failed to edit order" });
  }
};

/* ========= SHIPROCKET LIVE TRACKING ========= */

export const trackLiveShipment = async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) {
      return res.status(400).json({ success: false, error: "AWB missing" });
    }

    const token = await shiprocketAuth();
    const tracking = await trackShipmentByAwb(awb, token);

    const activities =
      tracking?.tracking_data?.shipment_track_activities || [];

    const latestEvent = activities[0];

    const mappedStatus = shipRocketStatusMap(
      latestEvent?.activity || latestEvent?.current_status
    );

    // 🔥 UPDATE ORDER STATUS HERE
    if (mappedStatus) {
      const order = await Order.findOne({
        "shiprocket.awb_code": awb,
      });

      if (order && order.orderStatus !== mappedStatus) {
        order.orderStatus = mappedStatus;

        if (mappedStatus === "delivered" && !order.deliveredAt) {
          order.deliveredAt = new Date();
        }

        await order.save();

        io.emit("order-updated", {
          orderId: order._id,
          orderStatus: order.orderStatus,
        });
      }
    }

    return res.json({ success: true, tracking });
  } catch (err) {
    console.error("trackLiveShipment error:", err);
    return res.status(500).json({
      success: false,
      tracking: null,
      error: "Internal tracking error",
    });
  }
};


// OPTIONAL: if you use this anywhere else
export const getTrackingLive = async (req, res) => {
  try {
    const { awb } = req.params;

    if (!awb) {
      return res
        .status(400)
        .json({ success: false, error: "AWB is required" });
    }

    const result = await trackShipment(awb);
    return res.json({ success: true, tracking: result });
  } catch (error) {
    console.error(
      "getTrackingLive error:",
      error.response?.data || error.message
    );

    return res.status(200).json({
      success: false,
      tracking: null,
      error:
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Tracking failed",
    });
  }
};


//enhancement


/* ========== 🔁 RETURN + REPLACEMENT FLOW ========== */

// user: request return (refund OR replacement)
export const requestOrderReturn = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason, type } = req.body; // type: "refund" | "replacement"

    if (!["refund", "replacement"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid return type" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).json({
        success: false,
        error: "Return / replacement allowed only after delivery.",
      });
    }

    const deliveredAt = order.deliveredAt || order.updatedAt || order.createdAt;
    const diffMs = Date.now() - new Date(deliveredAt).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > RETURN_WINDOW_DAYS) {
      return res.status(400).json({
        success: false,
        error: "Return window has expired.",
      });
    }

    if (order.returnStatus && order.returnStatus !== "none") {
      return res.status(400).json({
        success: false,
        error: "Return already requested or processed for this order.",
      });
    }

    order.returnStatus = "requested";
    order.returnType = type; // refund or replacement
    order.returnReason = reason || "";
    order.returnRequestedAt = new Date();

    await order.save();

    return res.json({ success: true, order });
  } catch (e) {
    console.error("requestOrderReturn error:", e);
    res.status(500).json({ success: false, error: "Failed to request return" });
  }
};

// admin: list all orders with some return activity
export const getReturnOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      returnStatus: { $ne: "none" },
    }).sort({ returnRequestedAt: -1, createdAt: -1 });

    res.json({ success: true, orders });
  } catch (e) {
    console.error("getReturnOrders error:", e);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch return orders" });
  }
};

// admin: approve / reject return / replacement
export const updateReturnStatusAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, note } = req.body; // status: "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid return status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found" });
    }

    if (order.returnStatus === "none") {
      return res.status(400).json({
        success: false,
        error: "No return was requested for this order.",
      });
    }

    order.returnStatus = status;
    order.returnAdminNote = note || "";
    order.returnResolvedAt = new Date();

    // If admin approves
    if (status === "approved") {
      // 1) REFUND FLOW (online payment)
      if (order.returnType === "refund") {
        if (
          order.paymentMethod === "RAZORPAY" &&
          order.paymentStatus === "paid" &&
          process.env.RAZORPAY_KEY_ID &&
          process.env.RAZORPAY_KEY_SECRET
        ) {
          const paymentId = order.paymentResult?.razorpay_payment_id;
          const refundAmountPaise = Math.round(order.total * 100);

          if (paymentId) {
            try {
              const refund = await razorpay.payments.refund(paymentId, {
                amount: refundAmountPaise,
              });

              order.refundInfo = {
                gateway: "razorpay",
                refundId: refund.id,
                amount: refund.amount / 100,
                currency: refund.currency,
                status: refund.status,
                raw: refund,
              };

              // mark as refunded
              order.paymentStatus = "refunded";
            } catch (err) {
              console.error("Razorpay refund error:", err);
              // still keep return approved; you can handle manual refund outside
              order.refundInfo = {
                gateway: "razorpay",
                refundId: null,
                amount: order.total,
                currency: "INR",
                status: "failed",
                raw: { message: err.message },
              };
            }
          }
        }

        // once refunded, we treat order as cancelled logically
        if (order.orderStatus !== "cancelled") {
          order.orderStatus = "cancelled";
        }
      }

      // 2) REPLACEMENT FLOW
      if (order.returnType === "replacement") {
        // create a new replacement order with same items & shipping
        const replacementOrder = await Order.create({
          userId: order.userId,
          items: order.items,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          // no new charge; it's a free replacement
          paymentStatus: "paid",
          paymentResult: {
            type: "replacement",
            originalOrderId: order._id,
            note: "Free replacement order",
          },
          subtotal: order.subtotal,
          shippingCharges: order.shippingCharges, // could be 0 if you want
          tax: order.tax,
          total: order.total,
          orderStatus: "processing",
          returnStatus: "none",
        });

        order.replacementOrderId = replacementOrder._id;

        // also mark original as cancelled
        if (order.orderStatus !== "cancelled") {
          order.orderStatus = "cancelled";
        }

        // (optional) here you could also immediately create Shiprocket order for replacement
      }
    }

    await order.save();

    res.json({ success: true, order });
  } catch (e) {
    console.error("updateReturnStatusAdmin error:", e);
    res
      .status(500)
      .json({ success: false, error: "Failed to update return status" });
  }
};

/* ========== CANCEL ORDER (immediate response, background Shiprocket + refund) ========== */

// controllers/orderController.js

// ========================
//  CANCEL ORDER (USER/ADMIN)
//  WITH AUTOMATIC REFUND
// ========================
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Already cancelled → return fast
    if (order.orderStatus === "cancelled") {
      return res.json({ success: true, order, message: "Order already cancelled" });
    }

    // STEP 1: update local DB immediately
    order.orderStatus = "cancelled";
    await order.save();

    io.emit("order-cancelled", {
      orderId: order._id,
      message: "Order cancelled → processing Shiprocket/refund",
    });

    // STEP 2: Respond to frontend instantly
    res.json({
      success: true,
      order,
      message: "Cancellation started",
    });

    // STEP 3: Process Shiprocket + Refund in background
    (async () => {
      const orderIdSR = order.shiprocket?.order_id;
      const shipmentIdSR = order.shiprocket?.shipment_id;

      console.log("CANCEL DEBUG → SR order_id:", orderIdSR, "shipment_id:", shipmentIdSR);

      // SHIPROCKET CANCEL
      if (orderIdSR || shipmentIdSR) {
        try {
          const srCancel = await cancelShiprocketOrder({
            orderId: orderIdSR,
            shipmentId: shipmentIdSR,
          });

          console.log("Shiprocket Cancel Response:", srCancel);

          const o2 = await Order.findById(order._id);
          if (o2) {
            o2.shiprocket = {
              ...(o2.shiprocket || {}),
              status: "cancelled",
            };
            await o2.save();

            io.emit("shiprocket-cancelled", { orderId: o2._id });
          }
        } catch (err) {
          console.error("Shiprocket cancel error:", err);
        }
      } else {
        console.warn("⚠ No Shiprocket order_id or shipment_id saved → cannot cancel in SR");
      }

      // RAZORPAY REFUND`
     // === RAZORPAY REFUND (IF PREPAID) ====================
if (order.paymentMethod === "RAZORPAY" && order.paymentStatus === "paid") {
  try {
    const paymentId = order.paymentResult?.razorpay_payment_id;
    if (!paymentId) throw new Error("Missing razorpay_payment_id");

    const refundAmountPaise = Math.round(order.total * 100);

    const refund = await razorpay.payments.refund(paymentId, {
      amount: refundAmountPaise,
      speed: "optimum",
    });

    // SAVE REFUND INFO INSIDE YOUR EXISTING SCHEMA
    const o = await Order.findById(order._id);
    if (o) {
      o.paymentStatus = "refunded";

      o.refundInfo = {
        gateway: "razorpay",
        refundId: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,      // e.g. processed / pending / failed
        raw: refund                 // FULL razorpay refund object
      };

      await o.save();

      io.emit("order-refunded", {
        orderId: o._id,
        refundId: refund.id,
      });
    }
  } catch (refundErr) {
    console.error("Refund error during cancel:", refundErr);

    // SAVE FAILURE INFO INSIDE SAME FIELD (NO SCHEMA CHANGE)
    const o = await Order.findById(order._id);
    if (o) {
      o.refundInfo = {
        gateway: "razorpay",
        refundId: null,
        amount: order.total,
        currency: "INR",
        status: "failed",
        raw: { error: refundErr.message } // store readable error
      };

      await o.save();
    }
  }
}
  })();

  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to cancel order",
    });
  }
};

//cancel return request
// cancel return request
export const cancelReturnRequest = async (req, res) => {
  try {
    const  { id }  = req.params; // ✅ FIXED

    console.log("🔥 Cancel return HIT for order:", id);

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    if (order.returnStatus !== "requested") {
      return res.status(400).json({
        success: false,
        error: "Return request cannot be cancelled at this stage",
      });
    }

    // reset return fields
    order.returnStatus = "none";
    order.returnType = null;
    order.returnReason = null;
    order.returnAdminNote = null;
    order.refundInfo = null;
    order.replacementOrderId = null;

    await order.save();

    return res.json({
      success: true,
      message: "Return request cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("Cancel return error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
