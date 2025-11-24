// controllers/orderController.js
import Order from "../model/Order.js";
import Product from "../model/productSchema.js"; // adjust path
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create COD order immediately
export const createOrderCOD = async (req, res) => {
  try {
    const { userId, items, shippingAddress, subtotal, shippingCharges = 0, tax = 0 } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const total = subtotal + shippingCharges + tax;

    // create order with paymentStatus = 'pending' but for COD treat as paid? you can mark paid=false
    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "pending",
      subtotal, shippingCharges, tax, total,
      orderStatus: "processing"
    });

    await order.save();
    return res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Stripe Checkout Session
export const createStripeSession = async (req, res) => {
  try {
    const { userId, items, shippingAddress, subtotal, shippingCharges = 0, tax = 0 } = req.body;
    const total = subtotal + shippingCharges + tax;

    // Build line_items for Stripe
    const line_items = items.map(it => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : undefined
        },
        unit_amount: Math.round(it.price * 100) // amount in paise
      },
      quantity: it.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/checkout/cancel`,
      metadata: {
        source: "stripe-checkout",
        userId: userId || "guest"
      }
    });

    // store a temporary order record with paymentStatus pending (optional)
    // You can also store after webhook confirms payment
    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Stripe error", error: err.message });
  }
};

// Stripe webhook to create order after payment success
// IMPORTANT: stripe requires raw body to validate signature
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Retrieve line items if you need product details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Convert lineItems to your order item structure
    const items = lineItems.data.map(li => ({
      product: null, // can't get product id from Stripe, store details instead or manage mapping
      name: li.description,
      price: li.amount_total / (100 * li.quantity), // best effort fallback
      quantity: li.quantity,
      image: li.price?.product?.images?.[0] || null
    }));

    // Create order record
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

    const order = new Order({
      userId: session.metadata?.userId || null,
      items,
      shippingAddress: {}, // you may capture address separately
      paymentMethod: "STRIPE",
      paymentStatus: "paid",
      paymentResult: session,
      subtotal,
      shippingCharges: 0,
      tax: 0,
      total: subtotal
    });

    await order.save();
  }

  res.json({ received: true });
};

// Create Razorpay order (server-side)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, items, subtotal, shippingCharges = 0, tax = 0 } = req.body;
    const total = subtotal + shippingCharges + tax;
    const amountInPaise = Math.round(total * 100); // INR paise

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1
    };

    const rOrder = await razorpayInstance.orders.create(options);

    // return razorpay order and key id to client
    return res.status(200).json({
      id: rOrder.id,
      currency: rOrder.currency,
      amount: rOrder.amount,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("Razorpay create error", err);
    return res.status(500).json({ message: "Razorpay error", error: err.message });
  }
};

// Verify Razorpay payment signature and create order after success
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, items, subtotal, shippingCharges = 0, tax = 0 } = req.body;

    // compute expected signature
    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const total = subtotal + shippingCharges + tax;

    // Create order in DB
    const order = new Order({
      userId,
      items: items.map(it => ({
        product: it._id || null,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || null
      })),
      shippingAddress: {}, // get from client or metadata
      paymentMethod: "RAZORPAY",
      paymentStatus: "paid",
      paymentResult: { razorpay_order_id, razorpay_payment_id },
      subtotal,
      shippingCharges,
      tax,
      total
    });

    await order.save();
    return res.status(200).json({ order });
  } catch (err) {
    console.error("verifyRazorpayPayment error", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
