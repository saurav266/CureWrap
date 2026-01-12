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
  cancelReturnRequest,
  requestReturn
} from "../controller/orderController.js";
import { adminReturnDecision } from "../controller/adminController.js";

const router = express.Router();

/* ===================== ADMIN ROUTES (put BEFORE `/:id`) ===================== */

// GET all orders (with filters done in controller)
router.get("/admin/all", getAllOrders);

// Edit order (shipping address etc.)
router.put("/admin/:id/edit", editOrder);
router.put(
  "/admin/return/:orderId/status",
  adminReturnDecision
);


// Update order status (processing, shipped, delivered, cancelled...)
router.put("/admin/:id/status", updateOrderStatus);

// Returns list
router.get("/admin/returns", getReturnOrders);

// Admin approve / reject return


/* ===================== CUSTOMER / PAYMENT / TRACKING ===================== */


// Place order
router.post("/place", placeOrder);

// Logged-in user orders
router.get("/my-orders", getUserOrders);
// for cancellation/refund tracking
router.put("/:id/cancel", cancelOrder);

// Mark COD as paid (manual)
router.put("/:id/mark-paid", markOrderPaid);

// 🔁 COD → Razorpay order (NOTE: no extra `/orders` here)
router.post("/:id/razorpay-order", createRazorpayOrderForCod);
// Request return (customer)
router.post("/:id/request-return", requestReturn);
// Cancel return request
router.put("/:id/cancel-return", cancelReturnRequest);
// Razorpay payment verify (COD → prepaid)
router.post("/payments/razorpay/verify", verifyRazorpayPaymentAndMarkPaid);

// Shiprocket tracking
router.get("/track/:awb", trackLiveShipment);
router.get("/track-live/:awb", getTrackingLive);

// User requests return / replacement
router.post("/:id/return", requestOrderReturn);

/* ===================== SINGLE ORDER (KEEP THIS LAST) ===================== */

// Get single order by ID
router.get("/:id", getOrderById);

export default router;
