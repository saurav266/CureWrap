// backend/routes/adminRoutes.js (or adminUserRoutes.js)
import express from "express";
import { getAdminStats } from "../controller/adminController.js";
import User from "../model/user.js";
import Order from "../model/orderSchema.js";
import Cart from "../model/Cart.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { adminReturnDecision } from "../controller/adminController.js";

const router = express.Router();

// ================== ADMIN STATS ==================
// GET /api/admin/stats
router.get("/stats",getAdminStats);

// ================== USERS LIST ===================
// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-otp -otpExpiresAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== DELETE USER ==================
// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // optional: prevent admin deleting themself
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== UPDATE USER ==================
// PATCH /api/admin/users/:id
router.patch("/users/:id",  async (req, res) => {
  try {
    const { name, email, phoneno } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phoneno !== undefined) user.phoneno = phoneno;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.otp;
    delete safeUser.otpExpiresAt;

    res.json(safeUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== SINGLE USER ==================
// GET /api/admin/users/:id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-otp -otpExpiresAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============= USER ORDERS / WISHLIST / CART =============

// GET /api/admin/users/:id/orders
router.get("/users/:id/orders",  async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users/:id/wishlist
router.get("/users/:id/wishlist",async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "wishlist",
      "name price"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.wishlist || []);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users/:id/cart
router.get("/users/:id/cart",  async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id }).populate(
      "items.product",
      "name price"
    );
    res.json(cart?.items || []);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
