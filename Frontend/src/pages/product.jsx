import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const products = [
  {
    id: 1,
    title: "CureWrap Compression Knee Sleeves 2-Pack – Ultimate Pain Relief",
    reviews: "6,066",
    rating: 5,
    discount: "-16%",
    image:
      "https://www.ubuy.co.in/product/8HIT6W-modvel-2-pack-knee-compression-sleeve-knee-brace-for-men-women-knee-support-for-running-basketball-weightlifting-gym-workout-sports?srsltid=AfmBOopjkN3QkqJis3WLg_EGudK553I5rQfFyiM-6AYa0y90LkPMUNvJ",
    description:
      "High-compression knee sleeves designed for support, stability, and pain relief.",
  },

  {
    id: 2,
    title: "Adjustable Knee Brace – Designed for Recovery, Made for Daily Life",
    reviews: "1,240",
    rating: 4,
    discount: "-7%",
    image:
      "https://m.media-amazon.com/images/I/71q8NfIJJXL._AC_SL1500_.jpg",
    description:
      "Dual-strap adjustable design for perfect comfort and long-term knee recovery.",
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));

  if (!product) return <h1 className="text-center mt-20 text-xl">Product Not Found</h1>;

  return (
    <div className="max-w-5xl mx-auto p-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl shadow-lg w-full object-cover"
        />

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>

          <p className="text-gray-500 mt-4 text-base">{product.description}</p>

          <p className="text-green-600 text-lg font-semibold mt-4">
            Discount: {product.discount}
          </p>

          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
