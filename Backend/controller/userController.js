import User from "../model/user.js";
import twilio from "twilio";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
   
    
    const newUser = new User({
      name,
      email,
      phoneNumber,
      otp,
      otpExpiresAt,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created and OTP sent via SMS",
      user: { name, email, phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via Twilio
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




export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP verified → issue JWT
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,   // cannot be accessed by JS
      secure: false,    // set true in production with HTTPS
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
  res.json({ success: true, message: "Logout successful on client side by deleting the token." });
}
export const isUserVerified = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.isVerified : false;
  } catch (error) {
    console.error("Error checking user verification:", error);
    return false;
  }
};

export const testTwilio = async (req, res) => {
  try {
    const { to } = req.body; // recipient number

    if (!to) {
      return res.status(400).json({ message: "Recipient phone number is required" });
    }

    const message = await twilioClient.messages.create({
      body: "Hello! Twilio test message 🚀",
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    res.json({
      success: true,
      message: "Test SMS sent successfully",
      sid: message.sid,
    });
  } catch (error) {
    console.error("Twilio test error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
