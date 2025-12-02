// controllers/orderController.js
import Order from "../model/orderSchema.js";
import {
  createShiprocketOrder,
  assignShiprocketAwb,
  generateShiprocketLabel,
  trackShipmentByAwb,
  trackShipment,
} from "../services/shiprocketService.js";
import ShiprocketAuth from "../services/shiprocketService.js";

/**
 * Place Order (Guest + Logged-in)
 * Supports paymentMethod: "COD" | "STRIPE" | "RAZORPAY"
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

    // ---------- BASIC VALIDATIONS ----------
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

    // ---------- NORMALIZE ITEMS ----------
    const normalizedItems = items.map((i, idx) => {
      const productId = i.productId || i.product || i._id || i.id;

      if (!productId) {
        console.warn(`Item at index ${idx} has no productId/product/_id/id`, i);
      }

      const name =
        i.name ||
        i.productName ||
        i.title ||
        `Item ${idx + 1}`;

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

    // ---------- VALIDATE PINCODE ----------
    const rawPincode = String(shippingAddress.postalCode || "").trim();
    if (!/^[1-9][0-9]{5}$/.test(rawPincode)) {
      return res.status(400).json({
        error: "Please enter a valid 6-digit pincode (Indian PIN code).",
      });
    }

    // ---------- PAYMENT STATUS ----------
    // Always start as pending. Razorpay/Stripe will mark as paid in their verify controllers.
    let paymentStatus = "pending";

    const finalUserId = userId || req.user?.id || null;

    // ---------- CREATE ORDER IN DB ----------
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
    });

    // ---------- SHIPROCKET INTEGRATION ----------
    // ⚠️ IMPORTANT:
    // - COD orders → create Shiprocket order immediately.
    // - Online payments (RAZORPAY, STRIPE) → Shiprocket will be called AFTER payment success in their verify controller.
    let shiprocketData = null;
    let awbData = null;
    let labelData = null;

    try {
      if (paymentMethod === "COD") {
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
            sku: i.product?.toString() || "NO-SKU",
            quantity: i.quantity,
            price: i.price,
          })),

          // COD only here
          payment_method: "COD",
          total,
          length: 10,
          breadth: 10,
          height: 5,
          weight: 0.5,
        };

        // 3) Create order in Shiprocket
        shiprocketData = await createShiprocketOrder(srPayload);
        const shipmentId = shiprocketData?.shipment_id;

        if (shipmentId) {
          // 4) Assign AWB
          awbData = await assignShiprocketAwb(shipmentId);

          // 5) Generate label
          labelData = await generateShiprocketLabel(shipmentId);

          // 6) Save back to Mongo
          order.shiprocket = {
            order_id: shiprocketData.order_id,
            channel_order_id: shiprocketData.channel_order_id,
            shipment_id: shiprocketData.shipment_id,
            status: shiprocketData.status,
            awb_code:
              awbData?.awb_code ||
              awbData?.response?.data?.awb_code ||
              null,
            courier_company_id:
              awbData?.courier_company_id ||
              awbData?.response?.data?.courier_company_id ||
              null,
            courier_name:
              awbData?.courier_name ||
              awbData?.response?.data?.courier_name ||
              null,
            label_url:
              labelData?.label_url ||
              labelData?.label_url_list?.[0] ||
              null,
          };

          await order.save();
        }
      }
    } catch (shipErr) {
      console.error(
        "Shiprocket error:",
        shipErr.response?.data || shipErr.message
      );
      // Don't fail the whole order if Shiprocket fails
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


// 🔹 Mark order as PAID (for COD after delivery)
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
        order.orderStatus = "shipped"; // or "delivered" depending on flow
      }
      await order.save();
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("markOrderPaid error:", err);
    res.status(500).json({ error: "Failed to mark order as paid" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentStatus: "paid" },   // any fully paid order
        { paymentMethod: "COD" },    // all COD orders (pending/paid)
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (e) {
    console.error("getAllOrders error:", e);
    res.status(500).json({ error: "Failed to fetch orders" });
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

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const validStatuses = [
      "processing",
      "shipped",
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
    order.orderStatus = status;
    await order.save();
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
    res.json({ success: true, order });
  } catch (e) {
    console.error("editOrder error:", e);
    res.status(500).json({ error: "Failed to edit order" });
  }
};

export const trackLiveShipment = async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) return res.status(400).json({ error: "AWB missing" });

    const token = await ShiprocketAuth();
    const trackingResult = await trackShipmentByAwb(awb, token);

    res.json({ success: true, tracking: trackingResult });
  } catch (e) {
    console.error("trackLiveShipment error:", e.message);
    res.status(500).json({ error: "Failed to track shipment" });
  }
};

export const getTrackingLive = async (req, res) => {
  try {
    const { awb } = req.params;

    if (!awb) return res.status(400).json({ error: "AWB is required" });

    const result = await trackShipment(awb);
    res.json({ success: true, tracking: result });
  } catch (error) {
    console.error("Tracking Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Tracking failed", details: error.message });
  }
};
