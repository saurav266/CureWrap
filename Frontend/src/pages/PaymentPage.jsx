// src/pages/PaymentPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/StepProgress";
import axios from "axios";

const BACKEND_URL = "";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  const steps = [
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Payment" },
    { key: "done", label: "Done" },
  ];

  // Load Razorpay SDK
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      if (window.Razorpay) setRazorpayReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay SDK loaded");
      setRazorpayReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      setError("Failed to load payment gateway. Please refresh the page.");
    };
    document.body.appendChild(script);
  }, []);

  // Load user, cart, shipping from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const cartStr = localStorage.getItem("cart");
    const shippingStr = localStorage.getItem("shippingAddress");

    if (!userStr) {
      navigate("/login", { state: { from: "/checkout/payment" } });
      return;
    }

    if (!cartStr || !shippingStr) {
      navigate("/checkout");
      return;
    }

    try {
      setUser(JSON.parse(userStr));
      setCart(JSON.parse(cartStr));
      setShippingAddress(JSON.parse(shippingStr));
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
      navigate("/checkout");
    }
  }, [navigate]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (s, it) => s + (it.sale_price || it.price || 0) * (it.quantity || 1),
        0
      ),
    [cart]
  );

  const shippingCharges = 0;
  const tax = 0;
  const total = subtotal + shippingCharges + tax;

  // Create order in your own DB (used by both COD & Razorpay)
  const createAppOrder = async () => {
    const payload = {
      items: cart,
      shippingAddress,
      paymentMethod, // "COD" | "RAZORPAY"
      subtotal,
      shippingCharges,
      tax,
      total,
      paymentResult: null,
      userId: user?._id || user?.id || null,
    };

    console.log("Creating app order with payload:", payload);

    const res = await axios.post(`${BACKEND_URL}/api/orders/place`, payload, {
      withCredentials: true,
    });

    if (!res.data || !res.data.order) {
      console.error("createAppOrder response:", res.data);
      throw new Error(
        res.data?.message || "Failed to create application order."
      );
    }

    console.log("App order created:", res.data.order);
    return res.data.order;
  };

  // COD flow
  const placeCodOrder = async () => {
    try {
      const order = await createAppOrder();

      localStorage.removeItem("cart");
      localStorage.removeItem("shippingAddress");
      localStorage.setItem("lastOrder", JSON.stringify(order));

      navigate(`/order-success/${order._id}`);
    } catch (err) {
      console.error(
        "Place COD order error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to place COD order"
      );
    }
  };

  // Razorpay flow
  const placeRazorpayOrder = async () => {
    try {
      if (!razorpayReady || !window.Razorpay) {
        setError("Payment gateway is still loading, please try again.");
        return;
      }

      // 1️⃣ Create your own app order first
      const appOrder = await createAppOrder();

      // 2️⃣ Ask backend to create Razorpay order
      const rpRes = await axios.post(
        `${BACKEND_URL}/api/payment/razorpay/create-order`,
        { totalAmount: appOrder.total }
      );

      const rpData = rpRes.data;
      console.log("Razorpay create-order response:", rpData);

      // Adjust to your backend shape: { success, order, key }
      const razorOrder = rpData.order;
      const razorKey = rpData.key;

      if (!rpData.success || !razorOrder?.id) {
        console.error("Razorpay create-order error:", rpData);
        setError(rpData.error || "Failed to create Razorpay order.");
        return;
      }

      if (!window.Razorpay) {
        setError("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      // 3️⃣ Open Razorpay checkout
      const options = {
        key: razorKey, // use key from backend
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "CureWrap",
        description: `Payment for Order ${appOrder._id}`,
        order_id: razorOrder.id,
        prefill: {
          name: shippingAddress?.name || "",
          email: user?.email || "test@example.com",
          contact: shippingAddress?.phone || "",
        },
        notes: {
          internal_order_id: appOrder._id,
        },
        handler: async function (response) {
          // ✅ Called ONLY when Razorpay says payment is successful
          console.log("Razorpay success response:", response);
          try {
            const verifyRes = await axios.post(
              `${BACKEND_URL}/api/payment/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: appOrder._id,
              }
            );

            console.log("Verify response:", verifyRes.data);

            if (!verifyRes.data || !verifyRes.data.success) {
              console.error("Verify error:", verifyRes.data);
              setError(
                verifyRes.data?.error ||
                  "Payment verification failed on server."
              );
              return;
            }

            // ✅ Payment confirmed & verified → success flow
            localStorage.removeItem("cart");
            localStorage.removeItem("shippingAddress");
            localStorage.setItem("lastOrder", JSON.stringify(appOrder));

            navigate(`/order-success/${appOrder._id}`);
          } catch (err) {
            console.error(
              "Verification error:",
              err.response?.data || err.message
            );
            setError("Payment verification failed.");
          }
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);

      // ⛔ Handle explicit payment failure / cancel
      rzp.on("payment.failed", function (resp) {
        console.error("Razorpay payment failed:", resp.error);
        setError(
          resp.error?.description ||
            resp.error?.reason ||
            "Payment failed or cancelled."
        );
        // 👉 Do NOT redirect to success here. Just show the error.
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay flow error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to start Razorpay payment"
      );
    }
  };

  // Common button handler
  const handlePlaceOrder = async () => {
    if (!shippingAddress || !cart.length) {
      alert("Missing cart or shipping details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "COD") {
        await placeCodOrder();
      } else if (paymentMethod === "RAZORPAY") {
        await placeRazorpayOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!shippingAddress) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <StepProgress steps={steps} current={2} />
        <p className="mt-6 text-center text-gray-600">
          Loading payment details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StepProgress steps={steps} current={2} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Order summary */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto border-b pb-3">
            {cart.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="flex justify-between"
              >
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  ₹
                  {(
                    (item.sale_price || item.price || 0) *
                    (item.quantity || 1)
                  ).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify_between">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingCharges ? `₹${shippingCharges}` : "Free"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment + shipping */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Payment</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              <span>Online Payment (Razorpay)</span>
            </label>
          </div>

          <div className="mb-4 text-sm">
            <h3 className="font-semibold mb-1">Shipping to:</h3>
            <p>
              {shippingAddress.name}
              <br />
              {shippingAddress.addressLine1}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
              <br />
              Phone: {shippingAddress.phone}
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order (COD)"
              : "Pay & Place Order"}
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-2 py-2 border rounded-md text-sm"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
