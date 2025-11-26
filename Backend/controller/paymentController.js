import Razorpay from "razorpay";
import 'dotenv/config';
import crypto from "crypto";
import  {Order} from "../model/orderSchema.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: "Razorpay order create failed" });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: "Verification failed" });
  }
};
