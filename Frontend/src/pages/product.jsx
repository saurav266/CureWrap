// src/components/ProductSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";

/**
 * ProductSection
 * - Minimal CureWrap-themed product grid
 * - Skeleton loading shimmer
 * - Category + Price filters
 * - No sorting (removed)
 * - Click image/card -> navigate to product page (useNavigate)
 * - Quick View modal (eye icon)
 * - Wishlist heart animation (local)
 *
 * Notes:
 * - backendUrl: change if your API is hosted elsewhere
 * - Fallback image uses the uploaded file available at:
 *     /mnt/data/yoga-2587066_1280.jpg
 */

export default function ProductSection() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [animateHeart, setAnimateHeart] = useState(null);
  const [quickView, setQuickView] = useState(null);

  // Filters
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const backendUrl = "http://localhost:8000";

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/users/products`);
      const data = await res.json();
      const arr = Array.isArray(data.products) ? data.products : [];
      setProducts(arr);
      setFiltered(arr);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build image url with backend prefix; fallback to uploaded local image
  const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";
  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  // Add to Cart (localStorage)
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  // Skeleton placeholder card
  const SkeletonCard = () => (
    <div className="border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="w-full h-[260px] bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded mt-4" />
      <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />
      <div className="h-4 bg-gray-200 rounded mt-4 w-1/2" />
      <div className="h-10 bg-gray-200 rounded mt-6" />
    </div>
  );


  return (
    <section className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 mb-10">
          <span className="text-green-600">OUR</span>{" "}
          <span className="text-[#2F86D6]">PRODUCTS</span>
        </h2>

        {/* Skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
          >
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-600">
                No products found for selected filters.
              </div>
            )}

            {filtered.map((p) => {
              const unit = p.sale_price || p.price || 0;
              const isOnSale = unit < (p.price || 0);
              const discount = isOnSale
                ? Math.round(((p.price - unit) / p.price) * 100)
                : 0;

              return (
                <motion.div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="relative bg-white rounded-xl border border-gray-200 p-4 pb-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Sale badge (inside padding so it never overlaps the image) */}
                  {isOnSale && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {discount}% OFF
                    </div>
                  )}

                  {/* Image block */}
                  <div
                    className="relative w-full h-[260px] rounded-lg overflow-hidden group mb-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${p._id}`);
                    }}
                  >
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* action icons: wishlist + quickview */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnimateHeart(p._id);
                          setTimeout(() => setAnimateHeart(null), 700);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                        aria-label="Add to wishlist"
                      >
                        <AiOutlineHeart size={22} className="text-gray-700" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickView(p);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                        aria-label="Quick view"
                      >
                        <AiOutlineEye size={22} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 mb-1">
                    {p.name}
                  </h3>

                  {/* Short description */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{p.short_description}</p>

                  {/* Price */}
                  <p className="text-green-700 font-bold text-lg">
                    ₹{unit.toLocaleString()}{" "}
                    {isOnSale && (
                      <span className="line-through text-gray-400 text-sm ml-2">
                        ₹{p.price.toLocaleString()}
                      </span>
                    )}
                  </p>

                  {/* Add to Cart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-full mt-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                    aria-label={`Add ${p.name} to cart`}
                  >
                    Add to Cart
                  </button>

                  {/* Heart burst when clicking wishlist */}
                  {animateHeart === p._id && (
                    <AiFillHeart className="text-red-500 text-4xl absolute top-12 right-12 animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Quick View modal */}
        {quickView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setQuickView(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-xl p-6 w-full max-w-3xl z-50 shadow-2xl"
            >
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black"
                aria-label="Close quick view"
              >
                ×
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: large image */}
                <div className="w-full rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(quickView.images?.[0])}
                    alt={quickView.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                {/* Right: info */}
                <div className="flex flex-col">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{quickView.name}</h3>

                  <p className="text-green-700 font-bold text-xl mb-3">
                    ₹{(quickView.sale_price || quickView.price).toLocaleString()}
                    {quickView.sale_price && (
                      <span className="line-through text-gray-400 text-sm ml-3">₹{quickView.price.toLocaleString()}</span>
                    )}
                  </p>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{quickView.description}</p>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => {
                        addToCart(quickView);
                        setQuickView(null);
                      }}
                      className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        setQuickView(null);
                        navigate(`/product/${quickView._id}`);
                      }}
                      className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex gap-3 mt-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600 font-bold">✔</div>
                      <div>
                        <div className="font-semibold text-gray-900">Premium Quality</div>
                        <div className="text-xs">Tested & certified</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600 font-bold">⏱</div>
                      <div>
                        <div className="font-semibold text-gray-900">Fast Shipping</div>
                        <div className="text-xs">Ships within 2 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
