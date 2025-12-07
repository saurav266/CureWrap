// shiprocketService.js
import axios from "axios";
import "dotenv/config";

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
   EXPORTS
============================================================ */
export const shiprocketAuth = getShiprocketToken;
export default shiprocketRequest;
