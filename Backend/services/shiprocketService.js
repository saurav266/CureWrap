// shiprocketService.js
import axios from "axios";
import "dotenv/config";

const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;       // API user email
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD; // API user password
const PICKUP_LOCATION = process.env.PICKUP_LOCATION || "work";
const CHANNEL_ID = process.env.SHIPROCKET_CHANNEL_ID || "";  // e.g. 8867739

let authToken = null;
let tokenExpiry = 0; // timestamp ms

async function getShiprocketToken() {
  const now = Date.now();

  // reuse token if not expired
  if (authToken && tokenExpiry && now < tokenExpiry) {
    return authToken;
  }

  if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
    throw new Error("Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD in .env");
  }

  const url = `${SHIPROCKET_API_URL}/auth/login`;

  const resp = await axios.post(url, {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD,
  });

  authToken = resp.data.token;

  // token valid 10 days, refresh a bit earlier (9 days)
  const NINE_DAYS_MS = 9 * 24 * 60 * 60 * 1000;
  tokenExpiry = now + NINE_DAYS_MS;

  return authToken;
}

async function shiprocketRequest(method, path, { data, params } = {}) {
  const token = await getShiprocketToken();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const url = `${SHIPROCKET_API_URL}${path}`;

  const resp = await axios({
    method,
    url,
    headers,
    data,
    params,
  });

  return resp.data;
}

/**
 * Create order + shipment in Shiprocket
 * orderData = {
 *   channel_order_id, customer_name, customer_last_name,
 *   address, city, pincode, state, country, email, phone,
 *   items: [{ name, sku, quantity, price }],
 *   payment_method: 'Prepaid' | 'COD',
 *   total, length, breadth, height, weight
 * }
 */
export async function createShiprocketOrder(orderData) {
  const {
    channel_order_id,
    customer_name,
    customer_last_name,
    address,
    city,
    pincode,
    state,
    country,
    email,
    phone,
    items,
    payment_method,
    total,
    length,
    breadth,
    height,
    weight,
  } = orderData;

  const payload = {
    order_id: channel_order_id, // your order id shown as channel_order_id in SR
    order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    pickup_location: PICKUP_LOCATION,
    channel_id: CHANNEL_ID,

    billing_customer_name: customer_name,
    billing_last_name: customer_last_name || "",
    billing_address: address,
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: country || "India",
    billing_email: email,
    billing_phone: phone,

    shipping_is_billing: true,

    order_items: items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.quantity,
      selling_price: item.price,
    })),

    payment_method, // "Prepaid" or "COD"
    sub_total: total,
    length: length || 10,
    breadth: breadth || 10,
    height: height || 5,
    weight: weight || 0.5,
  };

  return shiprocketRequest("post", "/orders/create/adhoc", { data: payload });
}

export async function assignShiprocketAwb(shipmentId, courierId = null) {
  const body = { shipment_id: shipmentId };
  if (courierId) body.courier_id = courierId;

  return shiprocketRequest("post", "/courier/assign/awb", { data: body });
}

export async function generateShiprocketLabel(shipmentId) {
  return shiprocketRequest("post", "/courier/generate/label", {
    data: { shipment_id: [shipmentId] },
  });
}

export async function trackShiprocketAwb(awbCode) {
  return shiprocketRequest("get", `/courier/track/awb/${awbCode}`);
}

export const trackShipmentByAwb = async (awb_code, token) => {
  try {
    const res = await axios.get(
      `${SHIPROCKET_API_URL}/courier/track/awb/${awb_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Track API Error:", err.response?.data || err.message);
    throw new Error("Tracking failed");
  }
};

export const trackShipment = async (awb) => {
  const token = await getShiprocketToken();
  const res = await axios.get(`${SHIPROCKET_API_URL}/courier/track/awb/${awb}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const shiprocketAuth = getShiprocketToken;
export default shiprocketRequest;