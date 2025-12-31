// src/components/ProductSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";

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
  const [maxPrice, setMaxPrice] = useState(5000);

  const backendUrl =  "";

  // ---------------- FETCH PRODUCTS ----------------
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

  // ---------------- IMAGE HELPER ----------------
  const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";
  const getImageUrl = (img) => {
    if (!img?.url) return FALLBACK_IMAGE;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  // ---------------- CART HANDLER ----------------
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  // ---------------- SKELETON CARD ----------------
  const SkeletonCard = () => (
    <div className="border border-gray-200 rounded-xl p-4 animate-pulse bg-white">
      <div className="w-full h-[260px] bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded mt-4" />
      <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />
      <div className="h-4 bg-gray-200 rounded mt-4 w-1/2" />
      <div className="h-10 bg-gray-200 rounded mt-6" />
    </div>
  );

  // ---------------- FILTER OPTIONS ----------------
  const categoryOptions = [
  { label: "All products", value: "all" },
  { label: "Knee Supports", value: "knee" },
  { label: "Back Supports", value: "back" },
  { label: "Posture Supports", value: "posture" },
  ];

  const maxAvailablePrice = useMemo(() => {
    if (!products.length) return 5000;
    const prices = products.map((p) => p.sale_price || p.price || 0);
    return Math.max(...prices, 5000);
  }, [products]);

  // ---------------- APPLY FILTERS ----------------
  useEffect(() => {
  let arr = [...products];

  if (category !== "all") {
    arr = arr.filter((p) => {
      const name = (p.name || "").toLowerCase();

      if (category === "knee") {
        return (
          name.includes("knee") &&
          (name.includes("brace") || name.includes("hinged"))
        );
      }

      if (category === "back") {
        return (
          name.includes("ls") ||
          name.includes("lumbar") ||
          name.includes("contoured")
        );
      }

      if (category === "posture") {
        return name.includes("posture");
      }

      return true;
    });
  }

  arr = arr.filter((p) => {
    const price = p.sale_price || p.price || 0;
    return price <= maxPrice;
  });

  setFiltered(arr);
}, [products, category, maxPrice]);


  // ---------------- STARS ----------------
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-[13px] ${
          i < (rating || 0) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));

  // ---------------- UI ----------------
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-green-600 mb-2">
            curewrap essentials
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">Therapeutic</span>{" "}
            <span className="text-[#2F86D6]">Support Range</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600 text-center max-w-2xl">
            Compression sleeves, braces and supports designed to stabilise your
            joints, reduce strain and keep you comfortably active all day.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">
              Filter by:
            </span>

            {/* Category select */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-400">
                Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-200 rounded-full px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range (max) */}
            <div className="inline-flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-400">
                Max price
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={maxAvailablePrice}
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-32 md:w-40 accent-green-600"
                />
                <span className="text-xs md:text-sm text-gray-700 font-medium">
                  ₹{maxPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Count / status */}
          <div className="text-xs md:text-sm text-gray-500 text-right">
            {!loading && !error && (
              <span>
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {products.length}
                </span>{" "}
                items
              </span>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="mb-8 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {filtered.length === 0 && !error && (
              <div className="col-span-full text-center py-12 text-gray-600">
                <p className="font-medium mb-1">
                  No products match your filters.
                </p>
                <p className="text-sm">
                  Try changing the category or increasing the price range.
                </p>
              </div>
            )}

            {filtered.map((p) => {
              const unit = p.sale_price || p.price || 0;
              const isOnSale = unit < (p.price || 0);
              const discount = isOnSale
                ? Math.round(((p.price - unit) / p.price) * 100)
                : 0;

              const rating = p.average_rating || 0;
              const reviewCount = p.total_reviews || 0;
              const stock = p.stock_quantity ?? p.stock ?? null;

              const isBestSeller = !!p.bestSeller;
              const isNew =
                p.created_at &&
                new Date(p.created_at) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // last 30 days

              // ✅ Use backend description if available
              const shortDesc =
                p.short_description ||
                p.shortDescription ||
                p.description ||
                "";

              return (
                <motion.div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="relative bg-white rounded-2xl border border-gray-200 p-4 pb-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                  whileHover={{ scale: 1.005 }}
                >
                  {/* Top-left badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {isOnSale && (
                      <span className="inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                        {discount}% OFF
                      </span>
                    )}
                    {isBestSeller && (
                      <span className="inline-flex items-center gap-1 bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                        ★ Best Seller
                      </span>
                    )}
                    {isNew && !isBestSeller && (
                      <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                        New Arrival
                      </span>
                    )}
                  </div>

                  {/* Image block */}
                  <div
                    className="relative w-full h-[260px] rounded-xl overflow-hidden group mb-4 bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${p._id}`);
                    }}
                  >
                    <img
                      src={getImageUrl(p.images?.[0])}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* action icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnimateHeart(p._id);
                          setTimeout(() => setAnimateHeart(null), 700);
                        }}
                        className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                        aria-label="Add to wishlist"
                      >
                        <AiOutlineHeart size={20} className="text-gray-700" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickView(p);
                        }}
                        className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                        aria-label="Quick view"
                      >
                        <AiOutlineEye size={20} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 hover:text-green-600 mb-1 line-clamp-1">
                    {p.name}
                  </h3>

                  {/* Rating + reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(rating)}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {rating ? rating.toFixed(1) : "No rating"}{" "}
                      {reviewCount > 0 && `• ${reviewCount} reviews`}
                    </span>
                  </div>

                  {/* ✅ Card description from backend, truncated */}
                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-3">
                    {shortDesc ||
                      "Breathable, stretchable fabric designed for daily wear and targeted support."}
                  </p>

                  {/* Stock + delivery info */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-green-700">
                      {stock === null
                        ? "In stock"
                        : stock > 8
                        ? "In stock"
                        : stock > 0
                        ? `Only ${stock} left`
                        : "Out of stock"}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Free delivery over ₹499
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <p className="text-green-700 font-bold text-lg">
                      ₹{unit.toLocaleString()}{" "}
                      {isOnSale && (
                        <span className="line-through text-gray-400 text-xs md:text-sm ml-2">
                          ₹{(p.price || 0).toLocaleString()}
                        </span>
                      )}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-500">
                      Inclusive of all taxes • COD available
                    </p>

                    {/* Add to Cart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      className="w-full mt-3 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:bg-gray-300"
                      aria-label={`Add ${p.name} to cart`}
                      disabled={stock === 0}
                    >
                      {stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>

                  {/* Heart burst */}
                  {animateHeart === p._id && (
                    <AiFillHeart className="text-red-500 text-4xl absolute top-10 right-10 animate-pulse" />
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
              className="relative bg-white rounded-2xl p-6 w-full max-w-3xl z-50 shadow-2xl"
            >
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-900"
                aria-label="Close quick view"
              >
                ×
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: large image */}
                <div className="w-full rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={getImageUrl(quickView.images?.[0])}
                    alt={quickView.name}
                    className="w-full h-80 md:h-96 object-cover rounded-xl"
                  />
                </div>

                {/* Right: info */}
                <div className="flex flex-col">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                    {quickView.name}
                  </h3>

                  {/* Rating line */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(quickView.average_rating || 0)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {quickView.average_rating
                        ? `${(quickView.average_rating || 0).toFixed(1)} • ${
                            quickView.total_reviews || 0
                          } reviews`
                        : "No reviews yet"}
                    </span>
                  </div>

                  <p className="text-green-700 font-bold text-xl mb-1">
                    ₹
                    {(quickView.sale_price || quickView.price).toLocaleString()}
                    {quickView.sale_price && quickView.price && (
                      <span className="line-through text-gray-400 text-sm ml-3">
                        ₹{quickView.price.toLocaleString()}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Inclusive of all taxes • Free shipping above ₹499
                  </p>

                  {/* ✅ Quick view uses full backend description */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {quickView.description ||
                      quickView.short_description ||
                      "Engineered with breathable, four-way stretch fabric that supports the joint without restricting movement. Ideal for daily wear, workouts or recovery days."}
                  </p>

                  {/* You can keep or remove these static bullet points as you like */}
                  <ul className="text-xs text-gray-700 space-y-1 mb-4">
                    <li>• Targeted compression for improved joint stability</li>
                    <li>• Sweat-wicking, odour-resistant inner lining</li>
                    <li>• Seamless edges to prevent skin irritation</li>
                    <li>• Suitable for all-day wear under clothing</li>
                  </ul>

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
                  <div className="flex flex-wrap gap-3 mt-6 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600 font-bold">
                        ✔
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Doctor Recommended
                        </div>
                        <div>Ideal for knee, elbow & back support</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600 font-bold">
                        ⏱
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Fast Dispatch
                        </div>
                        <div>Usually ships in 24–48 hours</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 grid place-items-center text-green-600 font-bold">
                        ↺
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Easy Returns
                        </div>
                        <div>7-day replacement & refund policy</div>
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
