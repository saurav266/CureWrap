import "dotenv/config";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import twilio from "twilio";
import { connectDB } from "./db/db.js";

import User from "./model/user.js"; // <-- REQUIRED IMPORT
import userRoute from "./route/userRoute.js";
import cartRoute from "./route/cartRoute.js";
import orderRoutes from "./route/orderRoute.js";
import adminRoutes from "./route/adminROute.js";
import paymentRoute from "./route/paymentRoute.js";


// Create Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Debug env
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Security & Performance
app.use(helmet());
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(apiLimiter);

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://yourdomain.com"],
    credentials: true,
  })
);

// JSON Body
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoute);

// ------------------ FIX DUPLICATE INDEX ISSUE ------------------

// ------------------ TEST OTP GENERATION USING TWILIO ------------------

// Generate random 6-digit OTP
// ------------------ TEST OTP GENERATION USING WHATS_TOOL ------------------

// Simple 6-digit OTP Generator
// ------------------ TEST OTP GENERATION USING WHATSTOOL ------------------

// 6-digit OTP generator
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/test-otp/send
// body: { "phone": "918123456789" }
app.post("/api/test-otp/send", async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required" });
    }

    // ✅ Format number for WhatsApp (e.g. +919876543210)
    phone = phone.toString().trim();
    if (!phone.startsWith("+")) {
      if (phone.startsWith("91")) phone = "+" + phone;
      else phone = "+91" + phone; // default India
    }

    const otp = generateOtp();

    // 🔑 Read from .env (YOU must set these)
    const apiUrl = process.env.WHATSTOOL_URL;     // e.g. "https://panel.whatstoolbusiness.com/api/v1/message/send" (check your panel!)
    const apiToken = process.env.WHATSTOOL_TOKEN; // your API key

    if (!apiUrl || !apiToken) {
      return res.status(500).json({
        success: false,
        error: "WhatsTool API URL or TOKEN not configured",
      });
    }

    console.log("Sending OTP via WhatsTool:", { apiUrl, phone, otp });

    // 📡 Call WhatsTool API
    const { data } = await axios.post(
      apiUrl,
      {
        // ⚠️ These fields MUST match WhatsTool docs (adjust if needed)
        number: phone.replace("+", ""), // some APIs want without +
        type: "text",
        message: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    console.log("WhatsTool response:", data);

    // If their API uses success flag / error field, check here
    // Adjust condition according to their docs
    return res.json({
      success: true,
      message: "OTP sent successfully via WhatsApp",
      otp, // ⛔ remove in production
      providerResponse: data,
    });
  } catch (error) {
    console.error(
      "WhatsTool OTP error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      error: "OTP sending failed",
      details: error.response?.data || error.message,
    });
  }
});




app.get("/", (req, res) => {
  res.send("Hello, CureWrap Backend Optimized!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
