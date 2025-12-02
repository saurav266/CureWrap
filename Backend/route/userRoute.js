import 'dotenv/config';
import { Router } from "express";
import { createUser, verifyOtp, login, logout } from "../controller/userController.js";
import { createProduct, getProductById, getProducts, updateProduct,deleteProduct} from "../controller/prodcutController.js";
import { addWishlist, getWishlist } from "../controller/wishListController.js";
import { unifiedLogin } from "../middleware/authMiddleware.js";


const router = Router();

// Auth routes
router.post("/register", createUser);
router.post("/login", unifiedLogin);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

// Product routes
router.post("/add-product", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Wishlist routes
router.post("/wishlist", addWishlist);
router.get("/wishlist/:userId", getWishlist);

// OTP sending route using WhatsTool API

router.post("/send-otp", async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    const baseUrl = process.env.WHATSTOOL_BASE_URL;
    const apiKey = process.env.WHATSTOOL_API_KEY;
    const apiNo = process.env.WHATSAPP_API_NO;

    if (!baseUrl || !apiKey || !apiNo) {
      return res.status(500).json({
        success: false,
        error: "WhatsTool BASE_URL, API_KEY or WHATSAPP_API_NO not configured",
      });
    }

    // Format phone: digits only, include country code (WhatsTool expects this)
    phone = phone.toString().trim();
    phone = phone.replace(/[^0-9]/g, ""); // remove +, spaces, etc.
    if (!phone.startsWith("91")) {
      phone = "91" + phone; // default India
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const url = `${baseUrl}/developers/v2/messages/${apiNo}`;
    console.log("Sending OTP via:", url, "to:", phone);

    // Payload must match WhatsTool docs
    const { data } = await axios.post(
      url,
      {
        to: phone,
        type: "text",
        text: {
          body: `Your CureWrap OTP is: ${otp}. It is valid for 5 minutes.`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    console.log("WhatsTool response:", data);

    // Adjust this check if their success format is different
    if (data.status && data.status !== 200) {
      return res.status(500).json({
        success: false,
        error: "WhatsTool returned an error",
        providerResponse: data,
      });
    }

    // For now we return OTP for testing – remove `otp` in production
    return res.json({
      success: true,
      otp,
      response: data,
    });
  } catch (err) {
    console.error("WhatsTool OTP error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: "OTP sending failed",
      details: err.response?.data || err.message,
    });
  }
});



// Cart routes


export default router;
