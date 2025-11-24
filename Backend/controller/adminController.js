import jwt from "jsonwebtoken";
import twilio from "twilio";
import 'dotenv/config';
import User from "../model/user.js";
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