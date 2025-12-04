// routes/wishlistRoutes.js
import express from "express";
import {
  addWishlist,
  getWishlist,
  removeWishlist,
  toggleWishlist,
} from "../controller/wishListController.js";

const router = express.Router();

// POST /api/wishlist/add
router.post("/add", addWishlist);

// POST /api/wishlist/remove
router.post("/remove", removeWishlist);

// POST /api/wishlist/toggle
router.post("/toggle", toggleWishlist);

// GET /api/wishlist/:userId
router.get("/:userId", getWishlist);

export default router;
