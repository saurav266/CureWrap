import express from "express";
import { checkPincode } from "../controller/shippingController.js";

const router = express.Router();

// POST /shipping/check-pincode


router.post("/check-pincode", checkPincode);

export default router;