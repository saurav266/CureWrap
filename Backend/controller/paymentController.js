// controllers/razorpayController.js
import Razorpay from "razorpay";
import "dotenv/config";
import crypto from "crypto";
import Order from "../model/orderSchema.js";

// ⬇️ import Shiprocket helpers
import {
  createShiprocketOrder,
  assignShiprocketAwb,
  generateShiprocketLabel,
} from "../services/shiprocketService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay order (for frontend checkout)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount, appOrderId } = req.body; // appOrderId optional but useful for receipt

    if (!totalAmount || totalAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: appOrderId ? `rcpt_${appOrderId}` : "rcpt_" + Date.now(),
      notes: {
        appOrderId: appOrderId || "",
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order create failed:", err.message);
    return res.status(500).json({
      success: false,
      error: "Razorpay order create failed",
      details: err.message,
    });
  }
};

// ✅ Verify Razorpay payment, update Order, then push to Shiprocket as PREPAID
export const verifyRazorpayPayment = async (req, res) => {
  try {
    console.log("verifyRazorpayPayment body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,    // may be undefined
      appOrderId, // from your frontend
    } = req.body;

    // Prefer orderId, fallback to appOrderId
    const effectiveOrderId = orderId || appOrderId;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !effectiveOrderId
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing payment details" });
    }

    // 1) Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid signature" });
    }

    // 2) Mark order as PAID in Mongo
    let updatedOrder = await Order.findByIdAndUpdate(
      effectiveOrderId,
      {
        paymentStatus: "paid",
        paymentMethod: "RAZORPAY",
        paymentResult: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "captured",
          paidAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found" });
    }

    // 3) Now create PREPAID order in Shiprocket
    let shiprocketData = null;
    let awbData = null;
    let labelData = null;

    try {
      const shippingAddress = updatedOrder.shippingAddress || {};
      const fullName = shippingAddress.name || "";
      const [firstName, ...restName] = fullName.split(" ");
      const lastName = restName.join(" ");
      const rawPincode = String(shippingAddress.postalCode || "").trim();

      const srPayload = {
        channel_order_id: `WEB-${updatedOrder._id}`,

        customer_name: firstName || fullName || "Customer",
        customer_last_name: lastName || "",
        address: shippingAddress.addressLine1,
        city: shippingAddress.city,
        pincode: rawPincode,
        state: shippingAddress.state,
        country: shippingAddress.country || "India",
        email:
          updatedOrder.paymentResult?.email || "noemail@example.com",
        phone: shippingAddress.phone,

        items: (updatedOrder.items || []).map((i) => ({
          name: i.name,
          sku: i.product?.toString() || "NO-SKU",
          quantity: i.quantity,
          price: i.price,
        })),

        // ✅ Razorpay is Prepaid
        payment_method: "Prepaid",
        total: updatedOrder.total,
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5,
      };

      // Create order in Shiprocket
      shiprocketData = await createShiprocketOrder(srPayload);
      const shipmentId = shiprocketData?.shipment_id;

      if (shipmentId) {
        // Assign AWB
        awbData = await assignShiprocketAwb(shipmentId);
        // Generate label
        labelData = await generateShiprocketLabel(shipmentId);

        // Save Shiprocket info back to Mongo
        updatedOrder.shiprocket = {
          order_id: shiprocketData.order_id,
          channel_order_id: shiprocketData.channel_order_id,
          shipment_id: shiprocketData.shipment_id,
          status: shiprocketData.status,
          awb_code:
            awbData?.awb_code ||
            awbData?.response?.data?.awb_code ||
            null,
          courier_company_id:
            awbData?.courier_company_id ||
            awbData?.response?.data?.courier_company_id ||
            null,
          courier_name:
            awbData?.courier_name ||
            awbData?.response?.data?.courier_name ||
            null,
          label_url:
            labelData?.label_url ||
            labelData?.label_url_list?.[0] ||
            null,
        };

        await updatedOrder.save();
      }
    } catch (shipErr) {
      console.error(
        "Shiprocket after Razorpay payment error:",
        shipErr.response?.data || shipErr.message
      );
      // don't fail payment verification response if Shiprocket fails
    }

    return res.json({
      success: true,
      order: updatedOrder,
      shiprocket: shiprocketData,
      awb: awbData,
      label: labelData,
    });
  } catch (e) {
    console.error("Razorpay verification failed:", e.message);
    return res
      .status(500)
      .json({ success: false, error: "Verification failed" });
  }
};



export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be refunded",
      });
    }

    const paymentId = order.paymentResult?.razorpay_payment_id;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: "No payment ID found" });
    }

    const refundResponse = await razorpay.payments.refund(paymentId, {
      amount: order.total * 100, // full refund
      speed: "optimum",
    });

    order.paymentStatus = "refunded";
    order.orderStatus = "cancelled";
    order.refundResult = {
      refundId: refundResponse.id,
      status: refundResponse.status,
      created_at: new Date(),
    };

    await order.save();

    return res.json({ success: true, message: "Refund initiated", order });
  } catch (err) {
    console.error("refundPayment error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};