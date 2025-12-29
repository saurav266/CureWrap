// src/components/product/RelatedProducts.jsx
import React from "react";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=No+Image";

export default function RelatedProducts({ related = [], onClick }) {
  if (!related.length) return null;

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        You May Also Like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((item) => {
          const img =
            item.images?.[0]?.url ||
            item.image ||
            FALLBACK_IMAGE;

          const price = item.sale_price || item.price || 0;

          return (
            <div
              key={item._id}
              onClick={() => onClick && onClick(item._id)}
              className="cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition p-3 bg-white group"
            >
              {/* Image */}
              <div className="w-full h-32 sm:h-40 overflow-hidden rounded-lg mb-2 sm:mb-3 bg-gray-100">
                <img
                  src={img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Name */}
              <p className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2">
                {item.name}
              </p>

              {/* Price */}
              <p className="text-green-700 font-bold text-xs sm:text-sm mt-1">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
