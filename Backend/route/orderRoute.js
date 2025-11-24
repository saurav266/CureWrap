// routes/orderRoute.js
import { Router } from "express";
import {
  createOrderCOD,
  createStripeSession,
  stripeWebhookHandler,
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/orderController.js";

const router = Router();

// COD order
router.post("/create-cod", createOrderCOD);

// Stripe checkout
router.post("/create-stripe-session", createStripeSession);

// Stripe webhook (raw body)
router.post("/webhook/stripe", stripeWebhookHandler);

// Razorpay create order
router.post("/razorpay/create", createRazorpayOrder);

// Razorpay verify payment
router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;
