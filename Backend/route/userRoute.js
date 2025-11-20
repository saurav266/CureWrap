import { Router } from "express";
import { createUser, otpVerification } from "../controller/userController.js";
const router = Router();

router.post("/register", createUser);
router.post("/verify-otp", otpVerification);
export default router;
