// src/pages/OrderPlaced.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepProgress from "../components/StepProgress";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function OrderPlaced() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || "N/A";

  const steps = [
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "payment", label: "Payment" },
    { key: "done", label: "Done" },
  ];

  useEffect(() => {
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 95, origin: { y: 0.4 } });
    }, 500);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <StepProgress steps={steps} current={3} />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          mt-10 bg-white/70 backdrop-blur-xl border border-gray-200
          p-10 rounded-2xl shadow-xl text-center
        "
      >
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="mx-auto w-24 h-24 rounded-full grid place-items-center bg-green-100 mb-6"
        >
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="text-6xl text-green-600 leading-none"
          >
            ✓
          </motion.span>
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully 🎉
        </h2>
        <p className="text-gray-600 text-lg">
          Thank you for choosing <span className="font-semibold text-green-600">CureWrap</span>.  
          Your order is now being processed.
        </p>

        {/* Order ID box */}
        <div
          className="
            mt-6 inline-block px-6 py-3 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-green-50 to-blue-50 text-gray-800
            border border-green-200 shadow-sm cursor-text
          "
        >
          Order ID: <span className="text-green-700">{orderId}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="
              px-8 py-3 rounded-full text-white font-semibold text-lg
              bg-green-600 shadow-lg hover:bg-green-700
              transition-all duration-300
            "
          >
            Continue Shopping
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/orders")}
            className="
              px-8 py-3 rounded-full text-lg font-semibold
              border border-gray-400 bg-white hover:bg-gray-50 shadow
              transition-all duration-300
            "
          >
            View My Orders
          </motion.button>
        </div>

        {/* Delivery est. info */}
        <div className="mt-10 text-gray-700 text-sm">
          <p>Estimated delivery: <span className="font-semibold text-green-700">3–6 business days</span></p>
          <p className="mt-1">You will receive live tracking updates via SMS & Email.</p>
        </div>
      </motion.div>
    </div>
  );
}
