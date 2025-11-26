// src/components/CartDrawer.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen: initialOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    const loadCart = () => {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cartData);
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const close = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const updateQuantity = (id, newQty) => {
    const updated = cart.map((item) => {
      const maxStock = item.stock || item.stock_quantity || 100;
      return item._id === id ? { ...item, quantity: Math.min(Math.max(1, newQty), maxStock) } : item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((sum, it) => sum + (it.sale_price || it.price || 0) * it.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 bg-black z-40"
            onClick={close}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-5 flex items-center justify-between border-b">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button onClick={close} className="text-gray-600 hover:text-gray-900">Close</button>
            </div>

            <div className="p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-600 py-16">
                  <div className="text-4xl mb-3">🛒</div>
                  <div>Your cart is empty</div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const price = item.sale_price || item.price || 0;
                      const maxStock = item.stock || item.stock_quantity || 100;
                      return (
                        <div key={item._id} className="flex gap-3 items-center">
                          <img
                            src={item.images?.[0]?.url || "/mnt/data/yoga-2587066_1280.jpg"}
                            className="w-20 h-20 object-cover rounded border"
                            alt={item.name}
                          />
                          <div className="flex-1">
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-500">₹{price.toLocaleString()}</div>

                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded border grid place-items-center"
                              >
                                −
                              </button>
                              <div className="px-2">{item.quantity}</div>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                disabled={item.quantity >= maxStock}
                                className="w-8 h-8 rounded border grid place-items-center"
                              >
                                +
                              </button>
                              <button onClick={() => removeItem(item._id)} className="ml-3 text-sm text-red-600">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-baseline">
                      <div className="text-sm text-gray-600">Subtotal</div>
                      <div className="text-lg font-bold">₹{subtotal.toLocaleString()}</div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => {
                          close();
                          // navigate to checkout route
                          window.location.href = "/checkout";
                        }}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold"
                      >
                        Proceed to Checkout
                      </button>
                      <button onClick={close} className="py-3 px-4 border rounded-lg">
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
