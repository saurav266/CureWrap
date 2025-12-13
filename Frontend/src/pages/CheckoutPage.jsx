// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/StepProgress";

const BACKEND_URL = "";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Shipping fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "RAZORPAY"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Payment" },
    { key: "done", label: "Done" },
  ];

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // ---------- Load Razorpay SDK ----------
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  // ---------- Load user + cart ----------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      if (parsedUser.name) setFullName(parsedUser.name);
      if (parsedUser.phoneno) setPhone(parsedUser.phoneno);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cartData.length) {
      navigate("/cart");
      return;
    }
    setCart(cartData);
  }, [navigate]);

  // Subtotal from cart
  const subtotal = cart.reduce(
    (s, it) => s + (it.sale_price || it.price || 0) * (it.quantity || 1),
    0
  );

  const shippingCharges = subtotal > 999 ? 0 : 49;
  const tax = 0;
  const total = subtotal + shippingCharges + tax;

  // ---------- Common validations ----------
  const validateForm = () => {
    if (!fullName || !phone || !address1 || !city || !stateName || !postalCode) {
      setError("Please fill all shipping fields.");
      return false;
    }

    const pin = String(postalCode).trim();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }

    if (!cart.length) {
      setError("Your cart is empty.");
      return false;
    }
    return true;
  };

  const buildShippingAddress = () => {
    const pin = String(postalCode).trim();
    return {
      name: fullName,
      phone,
      addressLine1: address1,
      city,
      state: stateName,
      postalCode: pin,
      country: "India",
    };
  };

  const buildOrderPayload = () => ({
    userId: user?._id || user?.id || null,
    paymentMethod, // "COD" or "RAZORPAY"
    subtotal,
    shippingCharges,
    tax,
    total,
    shippingAddress: buildShippingAddress(),
    items: cart,
  });

  // ---------- Create order in your DB ----------
  const createAppOrder = async () => {
    const payload = buildOrderPayload();
    console.log("Creating app order with payload:", payload);

    const res = await fetch(`${BACKEND_URL}/api/orders/place`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("place order non-JSON response:", text);
      throw new Error("Server did not return valid JSON for place order");
    }

    console.log("place order response:", res.status, data);

    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || "Failed to place order.");
    }
    return data.order; // { _id, total, ... }
  };

  // ---------- COD flow ----------
  const placeCodOrder = async () => {
    const order = await createAppOrder();

    localStorage.removeItem("cart");
    localStorage.setItem("lastOrderId", order?._id || "");

    // 👇 go to order tracking page
    navigate(`/orders/${order._id}`);
  };

  // ---------- Razorpay flow (using /api/payment/razorpay/*) ----------
  const placeRazorpayOrder = async () => {
    let appOrder = null;

    try {
      if (!window.Razorpay) {
        setError("Payment gateway is still loading. Please refresh the page.");
        console.error("window.Razorpay is not available");
        return;
      }

      // 1️⃣ Create app order first
      appOrder = await createAppOrder();
      console.log("App order created:", appOrder);

      // 2️⃣ Ask backend to create Razorpay order
      const rpRes = await fetch(
        `${BACKEND_URL}/api/payment/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: appOrder.total,
            appOrderId: appOrder._id,
          }),
        }
      );

      const rpText = await rpRes.text();
      let rpData;
      try {
        rpData = JSON.parse(rpText);
      } catch (e) {
        console.error("Razorpay create-order non-JSON response:", rpText);
        throw new Error(
          `Razorpay create-order did not return JSON (status ${rpRes.status})`
        );
      }

      console.log("Razorpay create-order response:", rpRes.status, rpData);

      const razorOrder = rpData.order || rpData.razorpayOrder;
      const razorKey =
        rpData.key ||
        import.meta?.env?.VITE_RAZORPAY_KEY_ID ||
        process.env.REACT_APP_RAZORPAY_KEY_ID;

      if (!rpRes.ok || !rpData.success || !razorOrder?.id || !razorKey) {
        console.error("Razorpay order error:", rpData);
        setError(rpData.error || "Failed to create Razorpay order.");

        // 🔥 Delete pending order since payment cannot proceed
        if (appOrder?._id) {
          try {
            await fetch(`${BACKEND_URL}/api/orders/${appOrder._id}`, {
              method: "DELETE",
            });
          } catch (delErr) {
            console.error("Failed to delete pending order:", delErr);
          }
        }
        return;
      }

      // 3️⃣ Open Razorpay checkout
      const options = {
        key: razorKey,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "CureWrap",
        description: `Payment for Order ${appOrder._id}`,
        order_id: razorOrder.id,
        prefill: {
          name: fullName,
          email: user?.email || "test@example.com",
          contact: phone,
        },
        notes: {
          appOrderId: appOrder._id,
        },
        handler: async function (response) {
          // ✅ Called ONLY when Razorpay says payment is successful
          console.log("Razorpay success response:", response);
          try {
            const verifyRes = await fetch(
              `${BACKEND_URL}/api/payment/razorpay/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  appOrderId: appOrder._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyText = await verifyRes.text();
            let verifyData;
            try {
              verifyData = JSON.parse(verifyText);
            } catch (e) {
              console.error("Verify non-JSON response:", verifyText);
              throw new Error(
                `Payment verify did not return JSON (status ${verifyRes.status})`
              );
            }

            console.log("Verify response:", verifyRes.status, verifyData);

            if (!verifyRes.ok || !verifyData.success) {
              console.error("Verify error:", verifyData);
              setError(
                verifyData.error || "Payment verification failed on server."
              );

              // 🔥 Delete order because payment not confirmed
              if (appOrder?._id) {
                try {
                  await fetch(`${BACKEND_URL}/api/orders/${appOrder._id}`, {
                    method: "DELETE",
                  });
                } catch (delErr) {
                  console.error(
                    "Failed to delete order after verify fail:",
                    delErr
                  );
                }
              }
              return;
            }

            // ✅ Payment verified, backend marked it as paid
            localStorage.removeItem("cart");
            localStorage.setItem("lastOrderId", appOrder._id);

            // 👇 go to order tracking page
            navigate(`/orders/${appOrder._id}`);
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed.");

            // 🔥 Cleanup order on verification exception
            if (appOrder?._id) {
              try {
                await fetch(`${BACKEND_URL}/api/orders/${appOrder._id}`, {
                  method: "DELETE",
                });
              } catch (delErr) {
                console.error(
                  "Failed to delete order after verify error:",
                  delErr
                );
              }
            }
          }
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);

      // ⛔ User closes / payment fails
      rzp.on("payment.failed", async function (resp) {
        console.error("Razorpay payment failed:", resp.error);
        setError(
          resp.error?.description ||
            resp.error?.reason ||
            "Payment failed or cancelled."
        );

        // 🔥 Delete pending order from DB
        if (appOrder?._id) {
          try {
            await fetch(`${BACKEND_URL}/api/orders/${appOrder._id}`, {
              method: "DELETE",
            });
            console.log(
              "Pending order deleted after payment.failed:",
              appOrder._id
            );
          } catch (delErr) {
            console.error("Failed to delete pending order:", delErr);
          }
        }
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay flow error:", err);
      setError(
        err.message || "Failed to start Razorpay payment. Please try again."
      );

      // Generic cleanup if something blew up after creating appOrder
      if (appOrder?._id) {
        try {
          await fetch(`${BACKEND_URL}/api/orders/${appOrder._id}`, {
            method: "DELETE",
          });
        } catch (delErr) {
          console.error("Failed to delete pending order in catch:", delErr);
        }
      }
    }
  };

  // ---------- Main button handler ----------
  const handlePlaceOrder = async () => {
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (paymentMethod === "COD") {
        await placeCodOrder();
      } else if (paymentMethod === "RAZORPAY") {
        await placeRazorpayOrder();
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // redirect already triggered
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <StepProgress steps={steps} current={1} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* LEFT: Shipping form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            Fill in your address to place your order.
          </p>

          {error && (
            <div className="mb-3 p-2 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              className="border rounded px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              placeholder="Phone"
              className="border rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              placeholder="Address line 1"
              className="border rounded px-3 py-2 md:col-span-2"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
            <input
              placeholder="City"
              className="border rounded px-3 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="State"
              className="border rounded px-3 py-2"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
            <input
              placeholder="Pincode"
              className="border rounded px-3 py-2"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Payment method */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Payment Method
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Online Payment (Razorpay)</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="py-2 px-4 border rounded text-sm"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="py-2 px-5 bg-green-600 text-white rounded text-sm font-semibold disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                ? "Place Order (COD)"
                : "Pay & Place Order"}
            </button>
          </div>
        </div>

        {/* RIGHT: Order summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 border-b border-dashed pb-2 last:border-0"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded object-cover border"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-semibold line-clamp-1">
                    {item.name || "Product"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.size && (
                      <>
                        Size: <span className="font-medium">{item.size}</span>{" "}
                      </>
                    )}
                    {item.color && (
                      <>
                        • Colour:{" "}
                        <span className="font-medium">{item.color}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Qty: {item.quantity || 1} ×{" "}
                    {currency(item.sale_price || item.price || 0)}
                  </p>
                  <p className="text-xs font-semibold text-gray-800">
                    Subtotal:{" "}
                    {currency(
                      (item.sale_price || item.price || 0) *
                        (item.quantity || 1)
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {shippingCharges === 0 ? "Free" : currency(shippingCharges)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{currency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
