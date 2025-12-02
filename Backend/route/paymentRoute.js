import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;
