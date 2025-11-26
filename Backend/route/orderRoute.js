import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateTracking,
} from "../controllers/orderController.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";
import { auth } from "../middleware/auth.js"; // you will create auth

const router = express.Router();

router.post("/place", auth, placeOrder);
router.get("/my-orders", auth, getUserOrders);
router.get("/:id", auth, getOrderById);
router.patch("/:id/tracking", updateTracking); // admin later

// Payments
router.post("/razorpay/create", auth, createRazorpayOrder);
router.post("/razorpay/verify", auth, verifyRazorpayPayment);

export default router;
