// src/components/CartDrawer.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen: initialOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => setIsOpen(initialOpen), [initialOpen]);

  useEffect(() => {
    const loadCart = () => {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(data);
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const close = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  const updateQuantity = (id, newQty) => {
    const updated = cart.map((it) => {
      const max = it.stock || 100;
      return it._id === id ? { ...it, quantity: Math.min(Math.max(1, newQty), max) } : it;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce(
    (sum, it) => sum + (it.sale_price || it.price || 0) * it.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={close}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b bg-gray-50">
              <h3 className="text-xl font-semibold tracking-wide">Your Cart</h3>
              <button onClick={close} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
            </div>

            {/* Cart */}
            <div className="p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-600 py-16">
                  <motion.div animate={{ scale: [0.9, 1.1, 1] }} transition={{ duration: 0.6 }}>
                    <div className="text-4xl mb-3">🛒</div>
                  </motion.div>
                  <div>Your cart is empty</div>
                </div>
              ) : (
                <>
                  {cart.map((item) => {
                    const price = item.sale_price || item.price || 0;
                    const maxStock = item.stock || 100;
                    const isDiscount = item.sale_price && item.sale_price < item.price;
                    const saved = isDiscount ? (item.price - item.sale_price) * item.quantity : 0;

                    return (
                      <div key={item._id} className="flex gap-3 items-start pb-4 border-b">
                        {/* Image */}
                        <img
                          src={item.image || item.images?.[0]?.url}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md border"
                        />

                        <div className="flex-1 space-y-1">
                          <div className="font-semibold leading-tight">{item.name}</div>

                          {/* Variant details */}
                          <div className="text-sm text-gray-600">
                            {item.selectedColor && (
                              <span className="mr-3">Color: <span className="font-medium">{item.selectedColor}</span></span>
                            )}
                            {item.selectedSize && (
                              <span>Size: <span className="font-medium">{item.selectedSize}</span></span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-green-700 font-semibold">₹{price.toLocaleString()}</span>
                            {isDiscount && (
                              <>
                                <span className="line-through text-gray-400 text-sm">₹{item.price}</span>
                                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                  SAVE ₹{saved.toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Stock indicator */}
                          <div className="text-xs text-amber-600">
                            {maxStock <= 5 && `⚠ Only ${maxStock} left!`}
                          </div>

                          {/* Quantity */}
                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 rounded border grid place-items-center">−</button>
                            <div className="px-2 font-medium">{item.quantity}</div>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= maxStock} className="w-7 h-7 rounded border grid place-items-center">+</button>
                            <button onClick={() => removeItem(item._id)} className="ml-auto text-sm text-red-600 font-medium">
                              Remove
                            </button>
                          </div>

                          {/* Delivery eta */}
                          <div className="text-xs text-gray-600 mt-1">🚚 Delivery by 3–5 days</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary */}
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-lg text-gray-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {/* Buttons */}
                    <button
                      onClick={() => {
                        close();
                        navigate("/checkout");
                      }}
                      className="w-full py-3 rounded-lg mt-3 text-white font-semibold bg-gradient-to-r from-green-600 to-lime-500 shadow-md hover:shadow-lg transition"
                    >
                      Proceed to Checkout →
                    </button>
                    <button onClick={close} className="w-full py-3 rounded-lg border font-medium">
                      Continue Shopping
                    </button>
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
