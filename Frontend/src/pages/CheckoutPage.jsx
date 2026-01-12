// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";



import StepProgress from "../components/StepProgress";

const BACKEND_URL = ""; // Adjust as needed

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  
const { user, authReady } = useAuth();
const isLoggedIn = Boolean(user);

  const [cart, setCart] = useState([]);
  

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

  const getCartImage = (item) => {
  if (item.image) {
    return item.image.startsWith("http")
      ? item.image
      : `${BACKEND_URL}/${item.image.replace(/^\/+/, "")}`;
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    const url = item.images[0].url;
    return url?.startsWith("http")
      ? url
      : `${BACKEND_URL}/${url?.replace(/^\/+/, "")}`;
  }

  return "https://placehold.co/100x100?text=No+Image";
};
  // ---------- Cart item updates ----------
  const updateCartItem = (index, updates) => {
  const newCart = cart.map((item, i) =>
    i === index ? { ...item, ...updates } : item
  );
  setCart(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

const changeQty = (index, delta) => {
  const item = cart[index];
  const newQty = Math.max(1, (item.quantity || 1) + delta);
  updateCartItem(index, { quantity: newQty });
};

const changeSize = (index, newSize) => {
  updateCartItem(index, { selectedSize: newSize });
};



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
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cartData.length) {
    navigate("/cart");
  } else {
    setCart(cartData);
  }
}, [navigate]);



if (!authReady) {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading checkout…
    </div>
  );
}

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





  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6">
      <StepProgress steps={steps} current={1} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT: Shipping form */}
        {/* LEFT: Shipping form */}
        <div
          className="
            bg-white p-6 rounded-lg shadow-sm border
            order-2 lg:order-1
            lg:col-span-2
            w-full
          "
        >

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
<motion.button
  whileHover={!loading ? { scale: 1.03 } : {}}
  whileTap={!loading ? { scale: 0.96 } : {}}
  animate={
    loading
      ? { opacity: 0.7 }
      : { opacity: 1 }
  }
  transition={{ type: "spring", stiffness: 300 }}
  disabled={loading}
  onClick={() => {
   if (!isLoggedIn) {
  navigate("/login", {
    state: { from: location } // ✅ FULL LOCATION OBJECT
  });
  return;
}

    handlePlaceOrder();
  }}
  className={`
    relative w-full sm:w-auto
    py-3 px-8 rounded-xl font-semibold text-base
    flex items-center justify-center gap-2
    shadow-md
    ${
      !isLoggedIn
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
        : "bg-green-600 text-white hover:bg-green-700"
    }
    ${loading ? "cursor-wait" : ""}
  `}
>
  {/* Loading spinner */}
  {loading && (
    <motion.span
      className="absolute left-4 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  )}

  {/* Button text */}
  <span className={`${loading ? "opacity-80" : ""}`}>
    {!isLoggedIn
      ? "Login to Place Order"
      : loading
      ? "Placing Order..."
      : "Place Order"}
  </span>
</motion.button>





          </div>
        </div>

        {/* RIGHT: Confirm Your Size & Quantity */}
        {/* RIGHT: Order Summary */}
        <div
          className="
            bg-white p-5 sm:p-6 rounded-lg shadow-sm border
            order-1 lg:order-2
            lg:col-span-1
            w-full
            sticky top-24
          "
        >


  <h2 className="text-lg sm:text-xl font-semibold mb-4">
    Confirm Your Size & Quantity
  </h2>

  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
    {cart.map((item, idx) => (
      <div
        key={idx}
        className="flex gap-3 border-b border-dashed pb-3 last:border-0"
      >
        {/* Image */}
        <img
          src={getCartImage(item)}
          alt={item.name || "Product"}
          onClick={() =>
            navigate(`/product/${item.productId}`)
          }
          className="w-20 h-20 rounded object-cover border cursor-pointer hover:opacity-80"
        />

        {/* Info */}
        <div className="flex-1 text-sm">
          {/* Name */}
          <p
            onClick={() =>
              navigate(`/product/${item.productId}`)
            }
            className="font-semibold line-clamp-2 cursor-pointer hover:text-green-600"
          >
            {item.name || "Product"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Selected: <span className="font-semibold">{item.selectedSize}</span>
          </p>


          {/* ✅ Size selector – use product-specific sizes */}
          {(() => {
            const sizes =
              Array.isArray(item.sizes) && item.sizes.length > 0
                ? item.sizes
                : ["S", "M", "L", "XL"]; // fallback for old cart items

            return (
              <div className="mt-1">
                <label className="text-xs text-gray-600">Size</label>
                <select
                  value={item.selectedSize || ""}
                  onChange={(e) => changeSize(idx, e.target.value)}
                  className="mt-1 w-24 border rounded px-2 py-1 text-sm"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            );
          })()}



          {/* Quantity controls */}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => changeQty(idx, -1)}
              className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100"
            >
              −
            </button>
            <span className="text-sm font-semibold">
              {item.quantity || 1}
            </span>
            <button
              onClick={() => changeQty(idx, 1)}
              className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Price */}
          <p className="text-xs font-semibold text-gray-800 mt-1">
            {currency(item.sale_price || item.price || 0)} ×{" "}
            {item.quantity || 1} ={" "}
            {currency(
              (item.sale_price || item.price || 0) *
                (item.quantity || 1)
            )}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Totals */}
  <div className="mt-5 border-t pt-4 text-sm space-y-1">
    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal</span>
      <span>{currency(subtotal)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping</span>
      <span>
        {shippingCharges === 0
          ? "Free"
          : currency(shippingCharges)}
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
