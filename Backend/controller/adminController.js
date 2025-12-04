import jwt from "jsonwebtoken";
import twilio from "twilio";
import 'dotenv/config';
import User from "../model/user.js";

import Order from "../model/orderSchema.js";
import mongoose from "mongoose";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const loginAdmin = async (req, res) => {
  const {phoneno } = req.body; // 👈 expect phone + otp

  try {
    // Find user by phone
    const user = await User.findOne({ phoneno });
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    // ✅ Check if this user is the admin (by email)
    if (user.email !== "saurav@example.com") {
      return res.status(403).json({ message: "Not an admin account." });
    }

    // ✅ Verify OTP
    

    // Clear OTP after successful login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
   

    // Create JWT token
     await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:phoneno,
    });

     res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getAdminStats = async (req, res) => {
  try {
    // 1) Total Users
    const usersCount = await User.countDocuments();

    // 2) Base filters
    // Orders that are not cancelled
    const nonCancelledFilter = { orderStatus: { $ne: "cancelled" } };

    // Orders that actually contribute to revenue:
    //   - not cancelled
    //   - paymentStatus = "paid"
    const revenueFilter = {
      orderStatus: { $ne: "cancelled" },
      paymentStatus: "paid",
    };

    // 3) Total Orders (exclude cancelled)
    const ordersCount = await Order.countDocuments(nonCancelledFilter);

    // 4) Total Revenue (sum of `total` for non-cancelled, paid orders)
    const revenueData = await Order.aggregate([
      { $match: revenueFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // 5) Monthly Revenue Graph (non-cancelled, paid only)
    const revenueGraphAgg = await Order.aggregate([
      { $match: revenueFilter },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          value: { $sum: "$total" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // 6) Monthly order count (Sales chart) - exclude cancelled
    const salesAgg = await Order.aggregate([
      { $match: nonCancelledFilter },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          value: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    return res.json({
      success: true,
      usersCount,
      ordersCount,
      totalRevenue,
      sales: salesAgg.map((s) => ({
        label: `Month ${s._id.month}`,
        value: s.value,
      })),
      revenueGraph: revenueGraphAgg.map((r) => ({
        label: `Month ${r._id.month}`,
        value: r.value,
      })),
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};

