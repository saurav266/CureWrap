import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MiniCart({ open, cart }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.sale_price || item.price) * item.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="
            absolute right-0 top-[115%] w-80 
            bg-white shadow-xl rounded-xl p-4 z-[500] 
            border border-gray-200
          "
        >
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Your Cart</h3>

          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Cart is empty</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1 text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{(item.sale_price || item.price).toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <div className="border-t mt-3 pt-3 text-right font-semibold text-gray-900">
                Subtotal: ₹{subtotal.toLocaleString()}
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  to="/cart"
                  className="w-1/2 py-2 border rounded-lg text-center font-semibold hover:bg-gray-100 transition"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  className="w-1/2 py-2 rounded-lg bg-green-600 text-white text-center font-semibold hover:bg-green-700 transition"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
