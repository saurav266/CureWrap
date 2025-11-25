// src/components/ProductSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animateHeart, setAnimateHeart] = useState(null);
  const [quickView, setQuickView] = useState(null);

  const backendUrl = "http://localhost:8000"; // Adjust your backend

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/products`);
        const data = await res.json();
        if (Array.isArray(data.products)) setProducts(data.products);
        else setProducts([]);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
      cart = cart.map((item) => (item._id === product._id ? existing : item));
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  // Helper for image URL
  const getImageUrl = (img) => {
    if (!img?.url) return "https://placehold.co/400x400?text=No+Image";
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  if (loading)
    return (
      <p className="p-10 text-center text-gray-500">Loading products...</p>
    );
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <section className="py-16 px-6 md:px-12 bg-white font-productBody">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-14 font-productTitle">
          OUR PRODUCTS
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
        >
          {products.map((p) => {
            const unitPrice = p.sale_price || p.price;
            const originalPrice = p.price;
            const isOnSale = unitPrice < originalPrice;
            const discountPercent = isOnSale
              ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
              : 0;
            const productImage = getImageUrl(p.images?.[0]);

            return (
              <motion.div
                key={p._id}
                variants={cardAnimation}
                className="relative bg-white shadow-md hover:shadow-xl transition p-3 pb-5 overflow-hidden"
              >
                {/* Discount badge */}
                {isOnSale && (
                  <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full">
                    -{discountPercent}%
                  </div>
                )}

                {/* Animated heart */}
                {animateHeart === p._id && (
                  <AiFillHeart className="text-red-500 text-4xl absolute top-8 right-10 animate-floatUp opacity-0" />
                )}

                {/* Product Image */}
                <div className="relative w-full h-[330px] overflow-hidden group">
                  <Link to={`/product/${p._id}`}>
                    <img
                      src={productImage}
                      alt={p.images?.[0]?.alt_text || p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    />
                  </Link>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                    <div className="relative group/icon">
                      <button
                        onClick={() => {
                          setAnimateHeart(p._id);
                          setTimeout(() => setAnimateHeart(null), 800);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                      >
                        <AiOutlineHeart size={24} className="text-gray-800" />
                      </button>
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white shadow px-2 py-1 rounded text-xs opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
                        Add to Wishlist
                      </span>
                    </div>

                    <div className="relative group/icon">
                      <button
                        onClick={() => setQuickView(p)}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                      >
                        <AiOutlineEye size={24} className="text-gray-800" />
                      </button>
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white shadow px-2 py-1 rounded text-xs opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
                        Quick View
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="px-5 pb-5 flex-1 flex flex-col">
                  <Link to={`/product/${p._id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-green-600 truncate">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {p.short_description ||
                      p.description ||
                      "No description available."}
                  </p>

                  {/* Price */}
                  <div className="mt-auto">
                    <p className="text-green-600 font-bold text-lg">
                      {isOnSale ? (
                        <>
                          ₹{unitPrice.toLocaleString()}{" "}
                          <span className="line-through text-gray-400 text-sm">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        `₹${unitPrice.toLocaleString()}`
                      )}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => addToCart(p)}
                        className="flex-1 py-2 border rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${p._id}`}
                        className="flex-1 py-2 border rounded bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              onClick={() => setQuickView(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">{quickView.name}</h3>
            <img
              src={getImageUrl(quickView.images?.[0])}
              alt={quickView.images?.[0]?.alt_text || quickView.name}
              className="w-full h-64 object-cover mb-4"
            />
            <p className="text-gray-700">
              {quickView.description || "No description available."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
