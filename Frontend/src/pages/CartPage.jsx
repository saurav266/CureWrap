// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  };

  useEffect(() => {
    loadCart();
    const handle = () => loadCart();
    window.addEventListener("cartUpdated", handle);
    return () => window.removeEventListener("cartUpdated", handle);
  }, []);

  const updateQuantity = (id, qty) => {
    const updated = cart.map((p) => {
      const max = p.stock || 100;
      return p._id === id ? { ...p, quantity: Math.min(Math.max(1, qty), max) } : p;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateSize = (id, newSize) => {
    const updated = cart.map((p) =>
      p._id === id ? { ...p, selectedSize: newSize } : p
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((p) => p._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce(
    (t, i) => t + (i.sale_price || i.price) * i.quantity,
    0
  );

  const savings = cart.reduce(
    (t, i) => t + (i.price - (i.sale_price || i.price)) * i.quantity,
    0
  );

  if (cart.length === 0)
    return (
      <div className="p-16 text-center text-gray-600 text-xl flex flex-col items-center">
        <span className="text-6xl mb-4">🛒</span>
        <p>Your cart is empty</p>
        <Link to="/product" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
          Shop Now
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      <div className="space-y-5">
        {cart.map((item) => {
          const price = item.sale_price || item.price;
          const maxStock = item.stock || 100;
          const youSave =
            item.sale_price && item.sale_price < item.price
              ? (item.price - item.sale_price) * item.quantity
              : 0;

          const sizes = item.availableSizes || ["S", "M", "L", "XL"];

          return (
            <div
              key={item._id}
              className="flex gap-5 border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={item.image || item.images?.[0]?.url}
                alt={item.name}
                className="w-28 h-28 object-cover border rounded-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>

                {/* Short Description */}
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Variant Info */}
                <div className="text-sm text-gray-600 mt-1">
                  {item.selectedColor && (
                    <span className="mr-4">
                      Color: <span className="font-semibold">{item.selectedColor}</span>
                    </span>
                  )}
                  {item.selectedSize && (
                    <span>
                      Size: <span className="font-semibold">{item.selectedSize}</span>
                    </span>
                  )}
                </div>

                {/* Size Dropdown */}
                <div className="mt-2">
                  <label className="text-gray-500 text-sm mr-1">Update Size:</label>
                  <select
                    value={item.selectedSize}
                    onChange={(e) => updateSize(item._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">
                    ₹{price.toLocaleString()}
                  </span>
                  {item.sale_price && item.sale_price < item.price && (
                    <span className="line-through text-gray-400 text-sm">
                      ₹{item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="text-xs text-amber-600 mt-1">
                  {maxStock <= 5 && `⚠ Only ${maxStock} left in stock!`}
                </div>

                {/* Quantity */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= maxStock}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-sm text-red-500 font-medium ml-4"
                  >
                    Remove
                  </button>
                </div>

                {/* Delivery Information */}
                <div className="text-xs text-gray-500 mt-2">
                  🚚 Delivery in <span className="font-medium">3–5 Days</span>
                </div>
                <div className="text-xs text-gray-500">🔄 7-Day Return Policy</div>
                <div className="text-s text-gray-600 mt-2">
                  ♻ Every product is eligible for <span className="font-semibold">7-Day Replacement</span> 
                  (for valid reasons only — wrong item, size issue, manufacturing defect).
                </div>

              </div>

              {/* Price Column */}
              <div className="text-right min-w-[120px]">
                <div className="font-bold text-xl">
                  ₹{(price * item.quantity).toLocaleString()}
                </div>
                {youSave > 0 && (
                  <div className="text-sm text-green-700">
                    You save ₹{youSave.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="mt-6 p-5 border rounded-xl bg-white shadow-sm">
          <div className="text-lg font-medium text-gray-600">
            Total Savings:{" "}
            <span className="text-green-700 font-semibold">₹{savings.toLocaleString()}</span>
          </div>
          <div className="text-3xl font-bold mt-1">
            Total: ₹{subtotal.toLocaleString()}
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
