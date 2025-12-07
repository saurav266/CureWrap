import User from "../model/user.js";
import axios from "axios";
import "dotenv/config";
import jwt from "jsonwebtoken";

/* ============================================================
   📌 NORMALIZE PHONE → ALWAYS STORE AS +91XXXXXXXXXX
============================================================ */
const normalizePhone = (phone) => {
  phone = phone.toString().trim().replace(/\D/g, ""); // keep digits only

  // If starts with 91 and is 12 digits → convert to 10-digit
  if (phone.startsWith("91") && phone.length === 12) {
    phone = phone.substring(2);
  }

  // If number still not 10 digits → invalid
  if (phone.length !== 10) {
    throw new Error("Invalid Indian phone number");
  }

  return "+91" + phone;
};

/* ============================================================
   🔢 Generate OTP
============================================================ */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ============================================================
   📩 Send OTP via WhatsTool API
============================================================ */
const sendWhatsToolOTP = async (phone, otp) => {
  const url = `${process.env.WHATSTOOL_BASE_URL}/developers/v2/messages/${process.env.WHATSTOOL_API_NO}`;

  const payload = {
    to: phone,
    type: "template",
    template: {
      id: process.env.WHATSTOOL_TEMPLATE_ID,
      body_text_variables: `${otp}`,
      dynamic_btn_variables: `${otp}`,
    },
  };

  await axios.post(url, payload, {
    headers: {
      "x-api-key": process.env.WHATSTOOL_API_KEY,
      "Content-Type": "application/json",
    },
  });
};

/* ============================================================
   🟢 REGISTER USER
============================================================ */
export const createUser = async (req, res) => {
  try {
    let { name, email, phoneno } = req.body;

    if (!name || !email || !phoneno) {
      return res.status(400).json({ message: "All fields are required" });
    }

    phoneno = normalizePhone(phoneno); // ALWAYS SAVE +91XXXXXXXXXX

    const existing = await User.findOne({ phoneno });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();

    await sendWhatsToolOTP(phoneno, otp);

    const newUser = new User({
      name,
      email,
      phoneno,
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "OTP sent & user created",
      user: { name, email, phoneno },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================
   🟡 LOGIN → SEND OTP
============================================================ */
export const login = async (req, res) => {
  try {
    let { phoneno } = req.body;
    if (!phoneno) {
      return res.status(400).json({ message: "Phone number required" });
    }

    let phone = normalizePhone(phoneno);

    const user = await User.findOne({ phoneno: phone });
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendWhatsToolOTP(phone, otp);

    res.json({ success: true, message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ============================================================
   🟢 VERIFY OTP → LOGIN USER + RETURN TOKEN
============================================================ */
export const verifyOtp = async (req, res) => {
  try {
    let { phoneno, otp } = req.body;

    if (!phoneno || !otp) {
      return res.status(400).json({ message: "Phone + OTP required" });
    }

    const phone = normalizePhone(phoneno);

    const user = await User.findOne({ phoneno: phone });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const logout = (req, res) => { res.clearCookie("authToken"); res.json({ success: true, message: "Logout successful" }); };
/* ============================================================
   🔵 GET PROFILE (userId from frontend)
============================================================ */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId)
      return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId).select("-otp -otpExpiresAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
