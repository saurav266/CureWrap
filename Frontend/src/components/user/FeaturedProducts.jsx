// src/components/FeaturedProductsCinematicSquareModal.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineClose,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaStar } from "react-icons/fa";

const uploadedImg = "/mnt/data/Screenshot 2025-11-23 at 4.50.18 AM.png";
const FALLBACK_IMAGE = "/mnt/data/yoga-2587066_1280.jpg";

const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

const BACKEND_URL = "http://localhost:8000";

// helpers
const formatPrice = (price) => `₹${Number(price || 0).toFixed(2)}`;

const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;

  // If backend sometimes sends a string instead of object
  if (typeof img === "string") {
    return img.startsWith("http")
      ? img
      : `${BACKEND_URL}/${img.replace(/^\/+/, "")}`;
  }

  if (!img.url) return FALLBACK_IMAGE;

  return img.url.startsWith("http")
    ? img.url
    : `${BACKEND_URL}/${img.url.replace(/^\/+/, "")}`;
};

export default function FeaturedProductsCinematicSquareModal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quickView, setQuickView] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heartBurstId, setHeartBurstId] = useState(null);
  const cardRefs = useRef({});

  // ===================== FETCH FEATURED PRODUCTS FROM BACKEND =====================
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BACKEND_URL}/api/users/products`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch featured products");
        }

        const arr = Array.isArray(data.products) ? data.products : [];

        // Normalize data for cinematic cards (limit to first 8 or whatever you want)
        const normalized = arr.slice(0, 8).map((p, index) => {
          const basePrice = Number(p.price || 0);
          const unitPrice = Number(p.sale_price || basePrice);
          const isOnSale = unitPrice < basePrice && basePrice > 0;
          const discountPercent = isOnSale
            ? Math.round(((basePrice - unitPrice) / basePrice) * 100)
            : 0;

          const mainImg = getImageUrl(p.images?.[0]);

          const allImgs = (p.images || []).map((img) => getImageUrl(img));
          const thumbs = [
            ...allImgs.slice(0, 3),
            uploadedImg, // brand / badge image
          ].filter(Boolean);

          return {
            id: p._id || index,
            title: p.name || "Product",
            priceNumber: unitPrice,
            price: formatPrice(unitPrice),
            originalPrice: basePrice,
            img: mainImg,
            discount: isOnSale ? `-${discountPercent}%` : null,
            rating: p.rating || 4,
            reviews: p.reviews || p.numReviews || 0,
            thumbs: thumbs.length ? thumbs : [mainImg],
          };
        });

        setProducts(normalized);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // prevent background scroll while modal open
  useEffect(() => {
    if (quickView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickView]);

  // keyboard accessibility for modal
  useEffect(() => {
    if (!quickView) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setQuickView(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((s) => Math.max(0, s - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((s) =>
          Math.min((quickView.thumbs?.length || 1) - 1, s + 1)
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [quickView]);

  const triggerHeartBurst = (id) => {
    setHeartBurstId(id);
    setTimeout(() => setHeartBurstId(null), 900);
  };

  const handleMove = (e, id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 12;
    const rotX = (0.5 - py) * 10;
    const img = el.querySelector(".fp-image");
    const shine = el.querySelector(".fp-shine");
    const badge = el.querySelector(".fp-badge");
    el.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    if (img)
      img.style.transform = `translateZ(30px) scale(1.06) translate(${
        (px - 0.5) * 8
      }px, ${(py - 0.5) * 6}px)`;
    if (shine)
      shine.style.background = `linear-gradient(135deg, rgba(255,255,255,${
        0.12 + px * 0.18
      }) 0%, rgba(255,255,255,0) 40%)`;
    if (badge)
      badge.style.transform = `translateZ(60px) translate(${
        (px - 0.5) * 10
      }px, ${(py - 0.5) * -6}px)`;
  };

  const handleLeave = (id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const img = el.querySelector(".fp-image");
    const shine = el.querySelector(".fp-shine");
    const badge = el.querySelector(".fp-badge");
    el.style.transform = `perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
    if (img) img.style.transform = `translateZ(0) scale(1) translate(0,0)`;
    if (shine)
      shine.style.background =
        "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)";
    if (badge) badge.style.transform = `translateZ(0) translate(0,0)`;
  };

  const openQuickView = (product) => {
    setQuickView(product);
    setSelectedIndex(0);
  };

  // ===================== RENDER =====================
  return (
    <>
      <section className="py-14 md:py-20 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Featured Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Hand-picked top-rated support essentials
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">Premium selection</div>
            </div>
          </div>

          {/* Loading / Error states */}
          {loading && (
            <div className="py-10 text-center text-gray-500">
              Loading featured products...
            </div>
          )}

          {!loading && error && (
            <div className="py-10 text-center text-red-500">{error}</div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No featured products available.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="relative">
                  <div
                    ref={(el) => (cardRefs.current[p.id] = el)}
                    onMouseMove={(e) => handleMove(e, p.id)}
                    onMouseLeave={() => handleLeave(p.id)}
                    className="group relative w-full h-[420px] lg:h-[480px] rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl overflow-hidden transition-transform duration-500"
                    style={{
                      transformStyle: "preserve-3d",
                      willChange: "transform",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

                    {/* badge */}
                    {p.discount && (
                      <div className="absolute top-4 left-4 z-20">
                        <div
                          className="fp-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{
                            background: `linear-gradient(90deg, ${brandBlue}, ${brandGreen})`,
                            boxShadow: "0 6px 26px rgba(0,0,0,0.18)",
                          }}
                        >
                          {p.discount}
                        </div>
                      </div>
                    )}

                    {/* heart burst */}
                    {heartBurstId === p.id && (
                      <div className="absolute top-6 right-6 z-40 pointer-events-none">
                        <motion.div
                          initial={{ scale: 0, y: 0, opacity: 1 }}
                          animate={{ scale: 1.6, y: -36, opacity: 0 }}
                          transition={{ duration: 0.9 }}
                          className="text-red-500"
                        >
                          <AiFillHeart size={30} />
                        </motion.div>
                      </div>
                    )}

                    {/* image layer */}
                    <div className="absolute inset-0 flex items-start justify-center p-6">
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <img
                          src={p.img}
                          alt={p.title}
                          loading="lazy"
                          className="fp-image w-full h-full object-cover transition-transform duration-700"
                        />
                        <div
                          className="fp-shine absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0))",
                          }}
                        />

                        {/* quick actions (visible on hover) */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-40 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                          <button
                            onClick={() => triggerHeartBurst(p.id)}
                            className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
                            title="Add to wishlist"
                          >
                            <AiOutlineHeart
                              className="text-gray-800"
                              size={18}
                            />
                          </button>

                          <button
                            onClick={() => openQuickView(p)}
                            className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
                            title="Quick view"
                          >
                            <AiOutlineEye
                              className="text-gray-800"
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* bottom info */}
                    <div className="absolute left-0 right-0 bottom-0 p-6 z-40">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: p.rating }).map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({p.reviews})
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-green-600 font-extrabold text-2xl">
                            {p.price}
                          </div>
                          {p.originalPrice &&
                            p.originalPrice > p.priceNumber && (
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(p.originalPrice)}
                              </div>
                            )}
                          <button className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition transform">
                            <AiOutlineShoppingCart /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================== SQUARE MODAL (Option C) =================== */}
      {quickView && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.36 }}
            className="bg-white/6 backdrop-blur-xl shadow-2xl w-full max-w-[980px] max-h-[90vh] rounded-3xl overflow-hidden relative flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`${quickView.title} quick view`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickView(null);
            }}
          >
            {/* Left: Main image + thumbs */}
            <div className="flex-1 grid grid-rows-[minmax(0,3fr)_auto]">
              {/* Main image */}
              <div className="px-6 pt-6">
                <div className="rounded-xl overflow-hidden w-full h-full shadow-inner flex items-center justify-center">
                  <img
                    src={quickView.thumbs?.[selectedIndex] || quickView.img}
                    alt={quickView.title}
                    loading="lazy"
                    className="w-full h-full max-h-[55vh] object-contain"
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = 1;
                    }}
                    style={{
                      opacity: 0,
                      transition: "opacity 260ms ease-in",
                    }}
                  />
                </div>
              </div>

              {/* Thumbnail ribbon */}
              <div className="px-6 pb-6">
                <div className="w-full flex items-center justify-center">
                  <div className="w-full max-w-[860px]">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                      {quickView.thumbs?.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIndex(i)}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                            selectedIndex === i
                              ? "border-green-600 scale-105"
                              : "border-transparent"
                          } transition-transform duration-300`}
                          style={{ width: 110, height: 70 }}
                        >
                          <img
                            src={t}
                            alt={`thumb-${i}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right-side overlay panel */}
            <div className="absolute top-8 right-8 w-80 bg-white/8 backdrop-blur-md p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-white/95">
                  {quickView.title}
                </h3>
                <button
                  onClick={() => setQuickView(null)}
                  className="text-white/90 hover:text-white"
                  aria-label="Close"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {Array.from({ length: quickView.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                <span className="text-sm text-white/80">
                  ({quickView.reviews} reviews)
                </span>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-extrabold text-green-400">
                  {quickView.price}
                </div>
                {quickView.originalPrice &&
                  quickView.originalPrice > quickView.priceNumber && (
                    <div className="text-xs text-white/70 line-through">
                      {formatPrice(quickView.originalPrice)}
                    </div>
                  )}
                <p className="text-sm text-white/80 mt-2">
                  Comfortable, breathable, and engineered for everyday support.
                </p>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition transform">
                    Add to Cart
                    <AiOutlineShoppingCart />
                  </button>

                  <button className="px-4 py-2 rounded-full border border-white/10 text-white/90 hover:bg-white/6 transition">
                    View Product
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <img
                    src={uploadedImg}
                    alt="logo"
                    className="w-8 h-8 rounded-md object-contain"
                  />
                  <div>
                    <div className="font-semibold">CureWrap Quality</div>
                    <div>Tested & Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .fp-image { transform-origin: center; will-change: transform; }
        .fp-shine { transition: background 220ms linear; }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-48px) scale(1.6); opacity: 0; }
        }
        .animate-floatUp { animation: floatUp 0.9s ease forwards; }

        @media (max-width: 1024px) {
          .backdrop-blur-xl { backdrop-filter: blur(8px); }
        }
      `}</style>
    </>
  );
}
