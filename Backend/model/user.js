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
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String, // Store the actual OTP code
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpExpiresAt: {
    type: Date, // Store expiry timestamp
  },

  // Wishlist: array of product references
  wishlist: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      addedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;