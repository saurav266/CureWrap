// src/controllers/adminController.js
import jwt from "jsonwebtoken";
import axios from "axios";
import "dotenv/config";
import User from "../model/user.js";
import Order from "../model/orderSchema.js"; // ✅ REQUIRED for stats

// ------------------------------------------------------------
// ✔ Generate 6-digit OTP
// ------------------------------------------------------------
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ------------------------------------------------------------
// ✔ Send OTP using WhatsTool API
// ------------------------------------------------------------
const sendWhatsToolOTP = async (phone, otp) => {
  const url = `${process.env.WHATSTOOL_BASE_URL}/developers/v2/messages/${process.env.WHATSTOOL_API_NO}`;

  const payload = {
    to: phone,
    type: "template",
    template: {
      id: "813468664842475", // your template ID
      body_text_variables: `${otp}`,
      dynamic_btn_variables: `${otp}`,
    },
  };

  console.log("📩 Sending WhatsApp OTP:", payload);

  const response = await axios.post(url, payload, {
    headers: {
      "x-api-key": process.env.WHATSTOOL_API_KEY,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// ------------------------------------------------------------
// ✔ ADMIN LOGIN (SEND OTP)
// ------------------------------------------------------------
export const loginAdmin = async (req, res) => {
  try {
    let { phoneno } = req.body;

    if (!phoneno) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    phoneno = phoneno.toString().trim();

    console.log("Admin Login Phone:", phoneno);

    // Find admin user
    const user = await User.findOne({ phoneno });

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    // ONLY admin can login
    if (user.email !== "s.basanti1954@yahoo.com") {
      return res.status(403).json({ message: "Not an admin account." });
    }

    // Generate OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP
    await sendWhatsToolOTP(phoneno, otp);

    return res.status(200).json({
      success: true,
      message: "Admin OTP sent successfully",
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------------------
// ✔ VERIFY ADMIN OTP & ISSUE JWT TOKEN
// ------------------------------------------------------------
export const verifyAdminOtp = async (req, res) => {
  try {
    const { phoneno, otp } = req.body;

    if (!phoneno || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    const cleanedPhone = phoneno.toString().trim();
    const user = await User.findOne({ phoneno: cleanedPhone });

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (user.email !== "s.basanti1954@yahoo.com") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    // Validate OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token for admin
    const token = jwt.sign(
      { adminId: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
      },
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------------------
// ✔ ADMIN DASHBOARD STATS (Used by AdminDashboard.jsx)
// ------------------------------------------------------------
export const getAdminStats = async (req, res) => {
  try {
    // 1) Total Users
    const usersCount = await User.countDocuments();

    // 2) Valid (Non-Cancelled) Orders
    const nonCancelledFilter = { orderStatus: { $ne: "cancelled" } };

    // 3) Revenue Orders (Paid + Not Cancelled)
    const revenueFilter = {
      orderStatus: { $ne: "cancelled" },
      paymentStatus: "paid",
    };

    // 4) Count Orders
    const ordersCount = await Order.countDocuments(nonCancelledFilter);

    // 5) Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: revenueFilter },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // 6) Monthly Sales (orders count)
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

    // 7) Monthly Revenue graph
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
