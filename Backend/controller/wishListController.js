// controller/wishlistController.js
import mongoose from "mongoose";
import User from "../model/user.js";

// Helper: find user either by Mongo _id or by phone number
async function findUserByIdOrPhone(userId, phoneno) {
  let user = null;

  // Try userId as ObjectId
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId);
    if (user) return user;
  }

  // Fallback: try phoneno
  if (!user && phoneno) {
    user = await User.findOne({ phoneno });
  }

  return user;
}

/**
 * 💖 ADD to wishlist (no duplicates)
 * Expect User schema:
 *   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
 */
export const addWishlist = async (req, res) => {
  try {
    const { userId, phoneno, productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    if (!userId && !phoneno) {
      return res.status(400).json({
        success: false,
        message: "userId or phoneno is required",
      });
    }

    const user = await findUserByIdOrPhone(userId, phoneno);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    // Prevent duplicates – wishlist is array of ObjectId
    const alreadyAdded = user.wishlist.some(
      (pid) => pid.toString() === productId
    );
    if (alreadyAdded) {
      const populated = await user.populate("wishlist");
      return res.json({
        success: false,
        message: "Product already in wishlist",
        wishlist: populated.wishlist,
      });
    }

    user.wishlist.push(productId); // 🔥 push ObjectId, not {product_id: ...}
    await user.save();

    const populated = await user.populate("wishlist");

    res.json({ success: true, wishlist: populated.wishlist });
  } catch (err) {
    console.error("addWishlist error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 📦 GET wishlist for a user
 * Supports either Mongo _id or phone in :userId param
 */
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params; // can be mongo id OR phone

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    let user = null;

    // If it looks like ObjectId, try that first
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).populate("wishlist");
    }

    // If not found, try as phone number
    if (!user) {
      user = await User.findOne({ phoneno: userId }).populate("wishlist");
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 🗑 REMOVE from wishlist
 */
export const removeWishlist = async (req, res) => {
  try {
    const { userId, phoneno, productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    if (!userId && !phoneno) {
      return res.status(400).json({
        success: false,
        message: "userId or phoneno is required",
      });
    }

    const user = await findUserByIdOrPhone(userId, phoneno);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const before = user.wishlist.length;

    // wishlist is array of ObjectId
    user.wishlist = user.wishlist.filter(
      (pid) => pid.toString() !== productId
    );

    if (user.wishlist.length === before) {
      const populated = await user.populate("wishlist");
      return res.json({
        success: false,
        message: "Product was not in wishlist",
        wishlist: populated.wishlist,
      });
    }

    await user.save();
    const populated = await user.populate("wishlist");

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: populated.wishlist,
    });
  } catch (err) {
    console.error("removeWishlist error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 🔁 TOGGLE wishlist (add/remove)
 */
export const toggleWishlist = async (req, res) => {
  try {
    const { userId, phoneno, productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    if (!userId && !phoneno) {
      return res.status(400).json({
        success: false,
        message: "userId or phoneno is required",
      });
    }

    const user = await findUserByIdOrPhone(userId, phoneno);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    const index = user.wishlist.findIndex(
      (pid) => pid.toString() === productId
    );

    let action;
    if (index === -1) {
      // add
      user.wishlist.push(productId);
      action = "added";
    } else {
      // remove
      user.wishlist.splice(index, 1);
      action = "removed";
    }

    await user.save();
    const populated = await user.populate("wishlist");

    res.json({
      success: true,
      action, // "added" | "removed"
      wishlist: populated.wishlist,
    });
  } catch (err) {
    console.error("toggleWishlist error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
