import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneno: {
    type: String, // Use String to preserve formatting like +91...
    required: true,
    unique: true,
  },
  otp: {
    type: String, // Store the actual OTP code
  },
  otpExpiresAt: {
    type: Date, // Store expiry timestamp
  },
});
const User = mongoose.model("User", userSchema);

export default User;
