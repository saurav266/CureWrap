import axios from "axios";

let shiprocketToken = null;

// Utility: login once and cache token
async function getShiprocketToken() {
  if (shiprocketToken) return shiprocketToken;

  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  shiprocketToken = res.data.token;
  return shiprocketToken;
}

// Controller: check pincode serviceability
export const checkPincode = async (req, res) => {
  const { pincode, cod = 1, weight = 0.5 } = req.body;

  try {
    const token = await getShiprocketToken();

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=110001&delivery_postcode=${pincode}&cod=${cod}&weight=${weight}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ ADD THIS BLOCK HERE
    const companies =
      response.data?.data?.available_courier_companies || [];

    const fastest = companies.length
      ? companies.sort(
          (a, b) =>
            (a.estimated_delivery_days || 999) -
            (b.estimated_delivery_days || 999)
        )[0]
      : null;

    const available = companies.length > 0;

    // ✅ SEND ETA + COURIER TO FRONTEND
    res.json({
      success: true,
      serviceable: available,
      etaDays: fastest?.estimated_delivery_days || null,
      courier: fastest?.courier_name || "Shiprocket",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Check failed" });
  }
};
