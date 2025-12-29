// src/components/product/ProductGallery.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductGallery({ product }) {
  const images = product.images || [];
  const [index, setIndex] = useState(0);

  const img = images[index]?.url || "";

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="h-[320px] flex items-center justify-center bg-gray-100">
        <motion.img
          key={index}
          src={img}
          alt={product.name}
          className="max-h-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 py-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                index === i ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
