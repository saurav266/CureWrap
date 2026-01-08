// routes/orderRoute.js
import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  editOrder,
  updateOrderStatus,
  trackLiveShipment,
  getTrackingLive,
  markOrderPaid,
  requestOrderReturn,
  getReturnOrders,
  updateReturnStatusAdmin,
  createRazorpayOrderForCod,
  verifyRazorpayPaymentAndMarkPaid,
  cancelOrder,
  cancelReturnRequest
} from "../controller/orderController.js";


const router = express.Router();

/* ===================== ADMIN ROUTES (put BEFORE `/:id`) ===================== */

// GET all orders (with filters done in controller)
/* ===================== CUSTOMER / PAYMENT / TRACKING ===================== */

// Place order
router.post("/place", placeOrder);

// Logged-in user orders
router.get("/my-orders", getUserOrders);

// Cancel order
router.put("/:id/cancel", cancelOrder);

// Mark COD as paid
router.put("/:id/mark-paid", markOrderPaid);

// Razorpay
router.post("/:id/razorpay-order", createRazorpayOrderForCod);
router.post("/payments/razorpay/verify", verifyRazorpayPaymentAndMarkPaid);

// Tracking
router.get("/track/:awb", trackLiveShipment);
router.get("/track-live/:awb", getTrackingLive);

// 🔁 User requests return
router.post("/:id/return", requestOrderReturn);

// 🔥🔥 CANCEL RETURN — MUST BE HERE (BEFORE `/:id`)
router.put("/:id/return/cancel", cancelReturnRequest);

/* ===================== SINGLE ORDER (KEEP LAST) ===================== */

// Get single order
router.get("/:id", getOrderById);


//cancel return request


export default router;
