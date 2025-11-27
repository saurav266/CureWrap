import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders
  
} from "../controller/orderController.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controller/paymentController.js";
 // you will create auth

const router = express.Router();

router.post("/place",  placeOrder);
router.get("/my-orders",  getUserOrders);
router.get("/:id",  getOrderById);
router.get("/", getAllOrders); // admin later
// router.patch("/:id/tracking", updateTracking); // admin later

// Payments
router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify",  verifyRazorpayPayment);

export default router;
