import React, { useState } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "CureWrap Compression Knee Sleeves 2-Pack – Ultimate Pain Relief",
    reviews: "6,066",
    rating: 5,
    discount: "-16%",
    image:
      "https://www.modvel.com/cdn/shop/products/MODVEL-Lower-Back-Brace-for-Lower-Back-Pain---Lumbar-Support-Belt-Modvel-1689504401218.webp?v=1742108332&width=900https://www.modvel.com/collections/best-deals/products/knee-brace-for-knee-pain",
  },
  {
    id: 2,
    title: "Adjustable Knee Brace – Designed for Recovery, Made for Daily Life",
    reviews: "1,240",
    rating: 4,
    discount: "-7%",
    image: "https://www.modvel.com/cdn/shop/products/Modvel-Adjustable-Knee-Brace-for-Knee-Pain-Relief_-Joint-Stability_-Recovery---Patella-Gel---Side-Support-MODVEL-1689503747605.webp?v=1742108128&width=900",
  },
  {
    id: 3,
    title: "Foot & Ankle Brace – Targeted Support for Stability & Motion",
    reviews: "441",
    rating: 5,
    discount: "-16%",
    image:
      "https://www.modvel.com/cdn/shop/products/Modvel-Ankle-Brace---Ankle-Support-Sleeves-for-Pain-relief_-Stability_-Injury-Prevention-and-Recovery-MODVEL-1689504925400.webp?v=1742108378&width=900",
  },
  {
    id: 4,
    title: "Back Brace w/ Reinforced 6-Stay Support for Relief & Mobility",
    reviews: "8,100",
    rating: 4,
    discount: "-25%",
    image:
      "https://www.modvel.com/cdn/shop/files/modvel-back-brace-6-stays-main.png?v=1742108530&width=900",
  },
  {
    id: 5,
    title: "Shoulder Support Brace – Stabilize & Recover Fast",
    reviews: "3,320",
    rating: 5,
    discount: "-20%",
    image:
      "https://www.modvel.com/cdn/shop/products/MODVEL-Elbow-Brace---Elbow-Support-Sleeves-for-Elbow-Joint-Pain_-Stability_-Injury-Prevention-and-Recovery-MODVEL-1689505285364.webp?v=1742108474&width=900",
  },
  {
    id: 6,
    title: "Elbow Compression Sleeve – Pain Relief for Workouts",
    reviews: "2,112",
    rating: 4,
    discount: "-12%",
    image:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
  },
];

const FeaturedProducts = () => {
  const [page, setPage] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentProducts = products.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <section className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Featured Products
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Explore Our Top-Rated Orthopedic Essentials
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl bg-white shadow-md hover:shadow-xl 
              transition-all duration-300 overflow-hidden relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {product.discount}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                flex items-center justify-center transition-all duration-300">
                  <button className="bg-white text-gray-700 text-xs font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100">
                    View Details
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-800 h-12 line-clamp-2">
                  {product.title}
                </h3>

                <button className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white 
                text-sm font-semibold py-3 rounded-full flex items-center justify-center gap-2 
                transition-all">
                  <FaShoppingCart className="text-sm" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION BUTTONS */}
       <div className="flex justify-center gap-3 mt-10">
  {Array.from({ length: totalPages }).map((_, i) => (
    <button
      key={i}
      onClick={() => setPage(i)}
      className={`w-3 h-3 rounded-full transition-all 
        ${page === i ? "bg-green-600 scale-125" : "bg-gray-300"}`}
    ></button>
  ))}
</div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
