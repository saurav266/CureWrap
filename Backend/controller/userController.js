import mongoose from "mongoose";
import User from "../model/user.js";
import "dotenv/config";
import twilio from "twilio";

console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const createUser = async (req, res) => {
  const { name, email, phoneno } = req.body;
  if (!name || !email || !phoneno) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneno,
    });

    const newUser = new User({ name, email, phoneno, otp, otpExpiresAt });
    await newUser.save();

    res.status(201).json({
      message: "User created and OTP sent successfully",
      user: { name, email, phoneno },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const otpVerification = async (req, res) => {
  const { phoneno, otp } = req.body;
  if (!phoneno || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    const user = await User.findOne({ phoneno });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Optionally clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};
