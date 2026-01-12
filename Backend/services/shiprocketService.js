// shiprocketService.js
import axios from "axios";
import "dotenv/config";
import Order from "../model/orderSchema.js";
import {
  codRefundFlow,
  onlineRefundFlow,
  
} from "../controller/paymentController.js";
import { replacementFlow } from "../controller/orderController.js";
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
const PICKUP_LOCATION = process.env.PICKUP_LOCATION || "work";
const CHANNEL_ID = process.env.SHIPROCKET_CHANNEL_ID || "";

let authToken = null;
let tokenExpiry = 0; // timestamp

/* ============================================================
   🚀 Generate / Reuse Shiprocket Token (Auto Refresh)
============================================================ */

function normalizeIndianPhone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

async function getShiprocketToken() {
  const now = Date.now();

  if (authToken && tokenExpiry > now) return authToken;

  if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
    throw new Error("Shiprocket credentials missing in .env");
  }

  const loginURL = `${SHIPROCKET_API_URL}/auth/login`;
  const resp = await axios.post(loginURL, {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD,
  });

  authToken = resp.data.token;

  // SR token validity = 10 days → we refresh in 9 days
  tokenExpiry = now + 9 * 24 * 60 * 60 * 1000;

  return authToken;
}

/* ============================================================
   🚀 Universal Request Helper
============================================================ */
async function shiprocketRequest(method, path, { data, params } = {}) {
  const token = await getShiprocketToken();

  const res = await axios({
    method,
    url: `${SHIPROCKET_API_URL}${path}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
    params,
  });

  return res.data;
}

/* ============================================================
   🚚 CREATE ORDER IN SHIPROCKET
============================================================ */
export async function createShiprocketOrder(payload) {
  const mapped = {
    order_id: payload.channel_order_id,
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    pickup_location: PICKUP_LOCATION,
    channel_id: CHANNEL_ID,

    billing_customer_name: payload.customer_name,
    billing_last_name: payload.customer_last_name || "",
    billing_address: payload.address,
    billing_city: payload.city,
    billing_pincode: payload.pincode,
    billing_state: payload.state,
    billing_country: payload.country || "India",
    billing_email: payload.email,
    billing_phone: payload.phone,

    shipping_is_billing: true,

    order_items: payload.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: i.quantity,
      selling_price: i.price,
    })),

    payment_method: payload.payment_method,
    sub_total: payload.total,
    length: payload.length || 10,
    breadth: payload.breadth || 10,
    height: payload.height || 5,
    weight: payload.weight || 0.5,
  };

  return shiprocketRequest("post", "/orders/create/adhoc", { data: mapped });
}

/* ============================================================
   🚚 ASSIGN AWB
============================================================ */
export async function assignShiprocketAwb(shipmentId, courierId = null) {
  const body = { shipment_id: shipmentId };
  if (courierId) body.courier_id = courierId;
  return shiprocketRequest("post", "/courier/assign/awb", { data: body });
}

/* ============================================================
   🏷️ GENERATE LABEL
============================================================ */
export async function generateShiprocketLabel(shipmentId) {
  return shiprocketRequest("post", "/courier/generate/label", {
    data: { shipment_id: [shipmentId] },
  });
}

/* ============================================================
   🔍 DIRECT TRACKING (throws error on 404)
============================================================ */
export async function trackShiprocketAwb(awbCode) {
  return shiprocketRequest("get", `/courier/track/awb/${awbCode}`);
}

/* ============================================================
   🔍 TRACKING WITH CUSTOM TOKEN (for backend usage)
============================================================ */
export const trackShipmentByAwb = async (awb, token) => {
  if (!awb) throw new Error("AWB missing");

  const url = `${SHIPROCKET_API_URL}/courier/track/awb/${awb}`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;

  } catch (err) {
    // let controller handle status codes
    throw err;
  }
};


/* ============================================================
   🔍 TRACKING SIMPLE (auto-token, may throw)
============================================================ */
export const trackShipment = async (awbCode) => {
  const token = await getShiprocketToken();
  const res = await axios.get(
    `${SHIPROCKET_API_URL}/courier/track/awb/${awbCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/* ============================================================
   ❌ CANCEL SHIPROCKET SHIPMENT (Correct API)
============================================================ */
/* ============================================================
   ❌ CANCEL SHIPROCKET ORDER — CORRECT WAY
============================================================ */
export const cancelShiprocketOrder = async ({ orderId, shipmentId }) => {
  const token = await getShiprocketToken();

  console.log("SHIPROCKET CANCEL → orderId:", orderId, "shipmentId:", shipmentId);

  // Try order cancel first
  if (orderId) {
    try {
      const url = `${SHIPROCKET_API_URL}/orders/cancel`;
      const body = { ids: [Number(orderId)] };

      const res = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { ok: true, used: "order_id", response: res.data };
    } catch (err) {
      console.error("cancel via order_id failed → will try shipment_id");
    }
  }

  // Fallback: try shipment cancel
  if (shipmentId) {
    try {
      const url = `${SHIPROCKET_API_URL}/courier/cancel/shipment/${shipmentId}`;
      const res = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { ok: true, used: "shipment_id", response: res.data };
    } catch (err) {
      return {
        ok: false,
        used: "shipment_id",
        error: err.response?.data || err.message,
      };
    }
  }

  return { ok: false, error: "No orderId or shipmentId found in DB" };
};
/* ============================================================
   🔁 CREATE SHIPROCKET RETURN PICKUP (REVERSE LOGISTICS)
============================================================ */
export async function createShiprocketReturn(order) {
  const token = await getShiprocketToken();

  if (!order.shiprocket?.order_id) {
    throw new Error("Original Shiprocket order_id missing");
  }

  const pickupPhone = normalizeIndianPhone(order.shippingAddress?.phone);
  const warehousePhone = normalizeIndianPhone(process.env.WAREHOUSE_PHONE);

  // 🔐 Hard validation (prevents Shiprocket 422 forever)
  if (!/^\d{10}$/.test(pickupPhone)) {
    throw new Error(`Invalid pickup phone: ${pickupPhone}`);
  }
  if (!/^\d{10}$/.test(warehousePhone)) {
    throw new Error(`Invalid warehouse phone: ${warehousePhone}`);
  }
  if (!/^\d{6}$/.test(String(process.env.WAREHOUSE_PINCODE))) {
    throw new Error(`Invalid warehouse pincode`);
  }

  const payload = {
    order_id: String(order.shiprocket.order_id),
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    channel_id: CHANNEL_ID,

    /* 🧍 CUSTOMER PICKUP */
    pickup_customer_name: order.shippingAddress?.name,
    pickup_address: order.shippingAddress?.addressLine1,
    pickup_address_2: order.shippingAddress?.addressLine2 || "",
    pickup_city: order.shippingAddress?.city,
    pickup_state: order.shippingAddress?.state,
    pickup_pincode: String(order.shippingAddress?.postalCode),
    pickup_country: order.shippingAddress?.country || "India",
    pickup_phone: pickupPhone, // ✅ FIXED

    /* 🏬 RETURN DELIVERY (WAREHOUSE) */
    shipping_customer_name: process.env.WAREHOUSE_NAME,
    shipping_address: process.env.WAREHOUSE_ADDRESS,
    shipping_city: process.env.WAREHOUSE_CITY,
    shipping_state: process.env.WAREHOUSE_STATE,
    shipping_pincode: process.env.WAREHOUSE_PINCODE,
    shipping_country: process.env.WAREHOUSE_COUNTRY || "India",
    shipping_phone: warehousePhone, // ✅ FIXED

    order_items: order.items.map((item) => ({
      name: item.name,
      sku: item.product?.toString() || item.name,
      units: item.quantity,
      selling_price: item.price,
    })),

    payment_method: "PREPAID",
    sub_total: order.subtotal,
    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5,
  };

  console.log("SHIPROCKET RETURN →", {
    pickup_phone: payload.pickup_phone,
    shipping_phone: payload.shipping_phone,
    shipping_pincode: payload.shipping_pincode,
  });

  try {
    const res = await axios.post(
      `${SHIPROCKET_API_URL}/orders/create/return`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      awb_code: res.data?.awb_code,
      courier_name: res.data?.courier_name,
      shipment_id: res.data?.shipment_id,
      raw: res.data,
    };
  } catch (err) {
    console.error(
      "Shiprocket return pickup error:",
      err.response?.data || err.message
    );
    throw new Error("Failed to create Shiprocket return pickup");
  }
}


export const shiprocketWebhook = async (req, res) => {
  try {
    // 🔐 1. Verify Shiprocket token
    const token = req.headers["x-api-key"];
    if (token !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
      console.warn("❌ Invalid Shiprocket webhook token");
      return res.sendStatus(401);
    }

    const { awb, current_status } = req.body;
    if (!awb || !current_status) return res.sendStatus(200);

    // 🔍 2. Find order by return AWB
    const order = await Order.findOne({ "returnPickup.awb": awb });
    if (!order) return res.sendStatus(200);

    const status = current_status.toUpperCase();

    /* ❌ PICKUP CANCELLED */
    if (["CANCELLED", "RTO_CANCELLED"].includes(status)) {
      order.returnPickup.status = "cancelled";
      await order.save();
      console.log("⚠️ Pickup cancelled for AWB:", awb);
      return res.sendStatus(200);
    }

    /* ❌ PICKUP FAILED */
    if (["PICKUP_FAILED"].includes(status)) {
      order.returnPickup.status = "failed";
      await order.save();
      console.log("⚠️ Pickup failed for AWB:", awb);
      return res.sendStatus(200);
    }

    /* ✅ PICKUP COMPLETED */
    const PICKUP_DONE_STATUSES = [
      "PICKED_UP",
      "DELIVERED",
      "RETURN_RECEIVED",
    ];

    if (!PICKUP_DONE_STATUSES.includes(status)) {
      return res.sendStatus(200);
    }

    // 🔐 Prevent double execution
    if (order.returnStatus === "completed") {
      return res.sendStatus(200);
    }

    order.returnPickup.status = "picked";

    // 💸 Refund flow
    if (order.returnType === "refund") {
      order.paymentMethod === "COD"
        ? await codRefundFlow(order)
        : await onlineRefundFlow(order);
    }

    // 🔁 Replacement flow
    if (order.returnType === "replacement") {
      await replacementFlow(order);
    }

    order.returnStatus = "completed";
    order.returnResolvedAt = new Date();
    await order.save();

    console.log("✅ Return processed successfully for AWB:", awb);
    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Shiprocket webhook error:", err);
    res.sendStatus(500);
  }
};


/* ============================================================
   EXPORTS
============================================================ */
export const shiprocketAuth = getShiprocketToken;
export default shiprocketRequest;
