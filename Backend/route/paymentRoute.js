import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  refundPayment
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/razorpay/refund", refundPayment);

export default router;
