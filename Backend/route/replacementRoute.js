import express from "express";
import Replacement from "../models/Replacement.js";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Request Replacement
router.post("/request", auth, async (req, res) => {
  try {
    const { orderId, productId, reason, images } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const deliveredAt = new Date(order.deliveredAt);
    const today = new Date();
    const diffDays = Math.floor((today - deliveredAt) / (1000 * 60 * 60 * 24));

    // validate replacement window
    const item = order.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    const allowedDays = item?.product?.return_policy?.days || 7;
    if (diffDays > allowedDays)
      return res.status(400).json({ message: "Replacement window expired" });

    const replacement = await Replacement.create({
      order: orderId,
      user: req.user.id,
      item: {
        product: productId,
        name: item.name,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity
      },
      reason,
      images
    });

    res.json({ message: "Replacement request submitted", replacement });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's replacement requests
router.get("/my", auth, async (req, res) => {
  const requests = await Replacement.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ requests });
});

export default router;
