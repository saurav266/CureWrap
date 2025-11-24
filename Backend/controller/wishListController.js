import express from "express";
import User from "../model/user.js";



export const addWishlist=async (req,res)=>{

   try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Prevent duplicates
    const alreadyAdded = user.wishlist.some(item => item.product_id.toString() === productId);
    if (alreadyAdded) {
      return res.json({ success: false, message: "Product already in wishlist" });
    }

    user.wishlist.push({ product_id: productId });
    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }

}

export const getWishlist=async (req,res)=>{

   try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("wishlist.product_id");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });  
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}