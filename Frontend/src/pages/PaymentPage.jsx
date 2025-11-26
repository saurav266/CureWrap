import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [cart, setCart] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  const backendUrl = "http://localhost:8000";

  //Load cart
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login first!");
      return navigate("/login");
    }

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartData.length === 0) return navigate("/cart");
    setCart(cartData);
  }, [navigate, isAuthenticated]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.sale_price || item.price) * item.quantity,
    0
  );

  // ---- Place Order function (COD + Razorpay both use this) ----
  const placeOrder = async (paymentStatus) => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: subtotal,
          paymentMode: selectedMethod,
          paymentStatus: paymentStatus
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order failed");

      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // ---- Razorpay payment handler ----
  const handleRazorpay = () => {
    setProcessing(true);

    const options = {
      key: "rzp_test_123456789", // Replace with your Razorpay key
      amount: subtotal * 100,
      currency: "INR",
      name: "CureWrap",
      description: "Order Payment",
      prefill: { email: "user@mail.com" },
      handler: (response) => {
        placeOrder("paid");
      },
      modal: { ondismiss: () => setProcessing(false) }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  // ---- Confirm Payment button click ----
  const handlePayment = () => {
    if (!selectedMethod) return toast.error("Select a payment method");
    if (selectedMethod === "cod") {
      setProcessing(true);
      placeOrder("pending");
    } else if (selectedMethod === "razorpay") {
      handleRazorpay();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />

      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      {/* Order Summary */}
      <div className="border rounded-lg p-4 bg-white shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-2 text-gray-700">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{((item.sale_price || item.price) * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-3 border-t pt-3 text-lg font-bold">
          Total: ₹{subtotal.toLocaleString()}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border rounded-lg p-4 bg-white shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-3">Select Payment Method</h2>

        <label className="flex items-center gap-3 mb-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selectedMethod === "cod"}
            onChange={() => setSelectedMethod("cod")}
          />
          <span className="text-gray-700 font-medium">Cash on Delivery</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="razorpay"
            checked={selectedMethod === "razorpay"}
            onChange={() => setSelectedMethod("razorpay")}
          />
          <span className="text-gray-700 font-medium">Razorpay (Online Payment)</span>
        </label>
      </div>

      {/* Continue / Pay Button */}
      <button
        onClick={handlePayment}
        disabled={processing}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {processing
          ? "Processing..."
          : selectedMethod === "razorpay"
          ? "Pay Securely with Razorpay"
          : selectedMethod === "cod"
          ? "Place Order (Cash on Delivery)"
          : "Proceed"}
      </button>
    </div>
  );
}
