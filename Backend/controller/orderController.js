// controllers/orderController.js
import Order from "../model/orderSchema.js";

/**
 * Place Order (Guest + Logged-in)
 * Supports paymentMethod: "COD" | "STRIPE" | "RAZORPAY"
 */
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,     // "COD", "STRIPE", "RAZORPAY"
      subtotal,
      shippingCharges = 0,
      tax = 0,
      total,
      paymentResult,     // optional: gateway response
      userId,            // optional: for guest checkout or can come from req.user
    } = req.body;

    // Basic validation
    if (!items || !items.length) {
      return res.status(400).json({ error: "No items in order" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }
    if (subtotal == null || total == null) {
      return res.status(400).json({ error: "Subtotal and total are required" });
    }

    // Decide paymentStatus based on method
    const paymentStatus =
      paymentMethod === "COD" ? "paid" : "pending"; // schema: "pending" | "paid" | "failed"

    // If you still have auth middleware, you can also read from req.user:
    const finalUserId = userId || req.user?.id || null;

    const order = await Order.create({
      userId: finalUserId,       // optional field
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentResult: paymentResult || null,
      subtotal,
      shippingCharges,
      tax,
      total,
      orderStatus: "processing", // default, can be overridden if you want
    });

    return res.json({ success: true, order });
  } catch (e) {
    console.error("placeOrder error:", e);
    res.status(500).json({ error: "Order failed" });
  }
};

/**
 * Get logged-in user's orders
 * (If you remove login completely, you can adjust this to accept userId from query)
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "userId is required to fetch orders" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) {
    console.error("getUserOrders error:", e);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * Get single order details by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (e) {
    console.error("getOrderById error:", e);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

/**
 * Update order status (Admin usage)
 * orderStatus could be: "processing", "shipped", "delivered", "cancelled" etc.
 * (You can define allowed values in schema if you want)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., "shipped", "delivered", "cancelled"

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await Order.findById(req.params.id);

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

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) {
    console.error("getAllOrders error:", e);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}