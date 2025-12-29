// src/components/product/ProductInfoPanel.jsx
import React from "react";

export default function ProductInfoPanel({ product }) {
  return (
    <div className="bg-white p-4 border rounded-xl shadow-sm">
      <h1 className="text-xl font-semibold">{product.name}</h1>

      <p className="mt-2 text-green-600 font-bold text-2xl">
        ₹{(product.sale_price || product.price).toLocaleString()}
      </p>

      {/* You can move size/color/qty/pincode logic here later */}
      <button className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg">
        Add to Cart
      </button>
    </div>
  );
}
