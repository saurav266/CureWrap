import express from "express";
import { checkPincode } from "../controller/shippingController.js";
import { shiprocketWebhook } from "../services/shiprocketService.js";
const router = express.Router();

// POST /shipping/check-pincode


router.post("/check-pincode", checkPincode);
router.post("/shiprocket/webhook", shiprocketWebhook);

export default router;