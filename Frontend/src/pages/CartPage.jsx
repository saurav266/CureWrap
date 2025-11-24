// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);

  const updateQuantity = (id, newQty) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, newQty) } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl flex flex-col items-center">
        <span className="text-5xl mb-4">🛒</span>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 border p-4 rounded-lg items-center bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={
                item.images?.[0]?.url ||
                "https://placehold.co/100x100?text=No+Image"
              }
              alt={item.name || "Product image"}
              className="w-24 h-24 object-cover rounded-md border"
            />

            <div className="flex-1">
              <div className="font-semibold text-lg">{item.name}</div>
              <div className="text-sm text-gray-600">₹{item.price}</div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  −
                </button>

                <div className="px-2 font-medium">{item.quantity}</div>

                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-lg">
                ₹{(item.price * item.quantity).toFixed(0)}
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-sm text-red-600 mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Subtotal Section */}
        <div className="mt-6 p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
          <div>
            <div className="text-gray-600">Subtotal</div>
            <div className="text-2xl font-bold">₹{calculateSubtotal().toFixed(0)}</div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}