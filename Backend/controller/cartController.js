// controllers/cartController.js
import Cart from "../model/Cart.js";
import Product from "../model/productSchema.js"; // adjust path to your product model
import mongoose from "mongoose";

/**
 * GET /api/cart/:userId
 * Returns a cart for a user (creates empty structure if none)
 */
export const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    let cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * POST /api/cart/add
 * body: { userId, productId, quantity }
 * Adds product to cart (increment if exists)
 */
export const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: "userId and productId required" });

  if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: "Invalid productId" });

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity, priceAtAdd: product.price }]
      });
    } else {
      const idx = cart.items.findIndex(it => it.product.toString() === productId);
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
        cart.items[idx].priceAtAdd = product.price;
      } else {
        cart.items.push({ product: productId, quantity, priceAtAdd: product.price });
      }
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * PUT /api/cart/update
 * body: { userId, productId, quantity }
 * Update quantity (if <=0 removes)
 */
export const updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: "userId and productId required" });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * DELETE /api/cart/remove
 * body: { userId, productId }
 */
export const removeCartItem = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: "userId and productId required" });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
