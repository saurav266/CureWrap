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
  const { phoneNumber } = req.body; // 👈 expect phone + otp

  try {
    // Find user by phone
    const user = await User.findOne({  phoneNumber });
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
      to: phoneNumber,
    });

     res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getAdminStats = async (req, res) => {
  try {
    // Total Users
    const usersCount = await User.countDocuments();

    // Total Orders
    const ordersCount = await Order.countDocuments();

    // Total Revenue (sum of `total` field)
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Monthly Revenue Graph
    const revenueGraph = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          value: { $sum: "$total" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // Monthly order count (sales chart)
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          value: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    return res.json({
      success: true,
      usersCount,
      ordersCount,
      totalRevenue,
      sales: sales.map((s) => ({
        label: `Month ${s._id.month}`,
        value: s.value,
      })),
      revenueGraph: revenueGraph.map((r) => ({
        label: `Month ${r._id.month}`,
        value: r.value,
      })),
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};

