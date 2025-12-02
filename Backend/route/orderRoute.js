// routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  // adminUpdateOrderContact,
  editOrder,
  updateOrderStatus,
  trackLiveShipment,
  getTrackingLive,
  markOrderPaid
} from "../controller/orderController.js"; // <- ensure 'controllers' or 'controller' matches your folder

// import {
//   createRazorpayOrder,
//   verifyRazorpayPayment,
// } from "../controller/paymentController.js"; // same here

// TODO: implement these in middleware/authMiddleware.js
// export const protect = (req, res, next) => { ... }
// export const isAdmin = (req, res, next) => { ... }
// import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC / CUSTOMER ROUTES
 */

// Place an order (guest + logged-in)
router.post("/place", placeOrder);

// Get orders for a specific user
// - If using JWT: userId will come from protect -> req.user.id
// - If no login: you can pass ?userId=... from frontend
router.get("/my-orders", getUserOrders);

// Get details of a single order by ID
router.get("/:id", getOrderById);
// Edit order (before processing)
// router.put("/:id/edit", protect, editOrder);
router.put("/admin/:id/edit", editOrder);


router.get("/track/:awb", trackLiveShipment);

router.get("/track/:awb", getTrackingLive);

router.put("/orders/:id/mark-paid", markOrderPaid);
/**
 * ADMIN ROUTES
 * All admin routes go under /admin prefix to avoid clashing with user paths
 */

// Get all orders (admin dashboard)
// router.get("/admin/all", protect, isAdmin, getAllOrders);
router.get("/admin/all", getAllOrders);

// Update order status: processing -> shipped -> delivered -> cancelled
// Body: { "status": "shipped" }
    // router.put("/admin/:id/status", protect, isAdmin, updateOrderStatus);
router.put("/admin/:id/status", updateOrderStatus);

// Update shipping address and/or phone number from admin panel
// Body example:
// {
//   "shippingAddress": {
//     "fullName": "Aman Kumar",
//     "phone": "9876543210",
//     "addressLine1": "Flat 203, Green Heights",
//     "addressLine2": "Near City Mall",
//     "city": "Patna",
//     "state": "Bihar",
//     "pincode": "800001"
//   },
//   "contactPhone": "9876543210" // optional, if you store separately
// }
// router.put(
//   "/admin/:id/contact",
//   protect,
//   isAdmin,
//   adminUpdateOrderContact
// );
// router.put(
//   "/admin/:id/contact",
//   adminUpdateOrderContact
// );

/**
 * PAYMENT ROUTES (Razorpay)
 */

// Create Razorpay order
// router.post("/razorpay/create", createRazorpayOrder);

// // Verify Razorpay payment signature
// router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;
