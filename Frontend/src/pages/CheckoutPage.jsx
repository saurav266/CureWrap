// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/StepProgress";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const steps = [
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Payment" },
    { key: "done", label: "Done" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("user"); // your chosen auth method
    if (!token) {
      // redirect to login with return path
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, [navigate]);

  const subtotal = cart.reduce((s, it) => s + (it.sale_price || it.price || 0) * it.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StepProgress steps={steps} current={1} />

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Shipping & Billing</h2>
        <p className="text-sm text-gray-600 mb-4">Fill in your shipping details to continue.</p>

        {/* Simple pseudo-form (replace with actual form) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Full name" className="border rounded px-3 py-2" />
          <input placeholder="Phone" className="border rounded px-3 py-2" />
          <input placeholder="Address line 1" className="border rounded px-3 py-2 md:col-span-2" />
          <input placeholder="City, State, ZIP" className="border rounded px-3 py-2" />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="text-lg font-bold">₹{subtotal.toLocaleString()}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="py-2 px-4 border rounded">Back</button>
            <button
              onClick={() => {
                // Save checkout info locally; in real app, call API to save order draft then navigate
                const checkoutDraft = { step: "checkout", createdAt: Date.now() };
                localStorage.setItem("checkoutDraft", JSON.stringify(checkoutDraft));
                navigate("/checkout/payment");
              }}
              className="py-2 px-4 bg-green-600 text-white rounded"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
