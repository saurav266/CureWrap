import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import twilio from "twilio";
import axios from "axios";
import { connectDB } from "./db/db.js";

import { Server } from "socket.io";

import User from "./model/user.js";
import userRoute from "./route/userRoute.js";
import cartRoute from "./route/cartRoute.js";
import orderRoutes from "./route/orderRoute.js";
import adminRoutes from "./route/adminRoute.js";
import paymentRoute from "./route/paymentRoute.js";
import wishlistRoutes from "./route/wishlistRoutes.js";
import contactRoute from "./route/contactRoute.js"
import shippingRoute from "./route/shippingRoute.js";
import productRoute from "./route/productRoute.js";

// ------------------ TWILIO CLIENT ------------------
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ------------------ CONNECT DB ------------------
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// ------------------ SECURITY & PERFORMANCE ------------------
app.use(helmet());
app.use(compression());
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(apiLimiter);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://curewrapplus.com"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ------------------ ROUTES ------------------
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/shipping", shippingRoute);
app.use("/api/users/products", productRoute);


// ------------------ START SERVER USING app.listen ------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ------------------ SOCKET.IO WORKS NOW ------------------
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔥 Admin Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin Disconnected:", socket.id);
  });
});

// ------------------ OTP HELPER ------------------
// function generateOtp() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// app.post("/api/test-otp/send", async (req, res) => {
//   try {
//     let { phone } = req.body;
//     if (!phone) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Phone number is required" });
//     }

//     phone = phone.toString().trim().replace("+", "");

//     const otp = generateOtp();

//     const baseUrl = process.env.WHATSTOOL_BASE_URL;
//     const apiNo = process.env.WHATSTOOL_API_NO;
//     const apiKey = process.env.WHATSTOOL_API_KEY;

//     const url = `${baseUrl}/developers/v2/messages/${apiNo}`;

//     const payload = {
//       to: phone,
//       type: "template",
//       template: {
//         id: "813468664842475",
//         body_text_variables: `${otp}`,
//         dynamic_btn_variables: `${otp}`,
//       },
//     };

//     console.log("WhatsTool payload:", payload);

//     const { data } = await axios.post(url, payload, {
//       headers: {
//         "x-api-key": apiKey,
//         "Content-Type": "application/json",
//       },
//     });

//     return res.json({
//       success: true,
//       message: "OTP sent via WhatsApp",
//       otp,
//       providerResponse: data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// });

// ------------------ ROOT ROUTE ------------------
app.get("/", (req, res) => {
  res.send("Hello, CureWrap Backend with WebSockets!");
});
