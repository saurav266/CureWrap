// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  };

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateQuantity = (id, newQty) => {
    const updatedCart = cart.map((item) => {
      const maxStock = item.stock || item.stock_quantity || 100;
      return item._id === id
        ? { ...item, quantity: Math.min(Math.max(1, newQty), maxStock) }
        : item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateSize = (id, newSize) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, selectedSize: newSize } : item
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
    cart.reduce(
      (sum, item) => sum + (item.sale_price || item.price) * item.quantity,
      0
    );

  const calculateSavings = () =>
    cart.reduce(
      (sum, item) =>
        sum + (item.price - (item.sale_price || item.price)) * item.quantity,
      0
    );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0)
    return (
      <div className="p-10 text-center text-gray-600 text-xl flex flex-col items-center">
        <span className="text-5xl mb-4">🛒</span>
        <p>Your cart is empty</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cart.map((item) => {
          const maxStock = item.stock || item.stock_quantity || 100;
          const price = item.sale_price || item.price;
          const sizes = ["S", "M", "L", "XL"];

          return (
            <div
              key={item._id}
              className="flex gap-4 border p-4 rounded-lg items-center bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={item.images?.[0]?.url || "https://placehold.co/100x100?text=No+Image"}
                alt={item.name || "Product image"}
                className="w-24 h-24 object-cover rounded-md border"
              />

              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>

                {/* Size Selector */}
                {sizes.length > 0 && (
                  <div className="mt-1">
                    <label className="text-gray-500 text-sm mr-2">Size:</label>
                    <select
                      value={item.selectedSize || sizes[0]}
                      onChange={(e) => updateSize(item._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {item.attributes?.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.attributes.map((a) => `${a.key}: ${a.value}`).join(", ")}
                  </div>
                )}

                <div className="text-sm text-gray-600 mt-1">₹{price.toLocaleString()}</div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    −
                  </button>
                  <div className="px-2 font-medium">{item.quantity}</div>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= maxStock}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                  <span className="text-gray-500 ml-2">Max: {maxStock}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg">
                  ₹{(price * item.quantity).toLocaleString()}
                </div>
                {item.sale_price && item.sale_price < item.price && (
                  <div className="text-sm text-red-500">
                    Saved ₹{((item.price - item.sale_price) * item.quantity).toLocaleString()}
                  </div>
                )}
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-sm text-red-600 mt-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 border rounded-lg flex flex-col md:flex-row justify-between items-center bg-white shadow-sm">
          <div className="mb-3 md:mb-0">
            <div className="text-gray-600">Total Items: {totalItems}</div>
            <div className="text-gray-600">
              Total Savings: ₹{calculateSavings().toLocaleString()}
            </div>
            <div className="text-gray-600">Subtotal:</div>
            <div className="text-2xl font-bold">₹{calculateSubtotal().toLocaleString()}</div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
