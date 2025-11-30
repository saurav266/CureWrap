// FeaturedProductsCinematicSquareModal.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineClose,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import lsBelt from "../../assets/Frontend_assets/curewrap/lsBelt.png";

const uploadedImg = "/mnt/data/Screenshot 2025-11-23 at 4.50.18 AM.png";
const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";
const backendUrl = "http://localhost:8000";

// Fallback products if backend fails (keeps UX working)
const fallbackProducts = [
  {
    id: 1,
    title: "Curewrap Compression Knee Sleeves",
    price: "₹25.00",
    img: lsBelt,
    discount: "-18%",
    rating: 5,
    reviews: 6066,
    thumbs: [lsBelt, lsBelt, lsBelt, uploadedImg],
  },
  {
    id: 2,
    title: "Curewrap Adjustable Knee Brace",
    price: "₹35.00",
    img: lsBelt,
    discount: "-7%",
    rating: 3,
    reviews: 112,
    thumbs: [lsBelt, lsBelt, lsBelt, uploadedImg],
  },
  {
    id: 3,
    title: "Curewrap Foot & Ankle Brace Support",
    price: "₹40.00",
    img: lsBelt,
    discount: "-16%",
    rating: 4,
    reviews: 441,
    thumbs: [lsBelt, lsBelt, lsBelt, uploadedImg],
  },
  {
    id: 4,
    title: "Curewrap Reinforced Back Brace",
    price: "₹50.00",
    img: lsBelt,
    discount: "-25%",
    rating: 4,
    reviews: 892,
    thumbs: [lsBelt, lsBelt, lsBelt, uploadedImg],
  },
];

export default function FeaturedProductsCinematicSquareModal() {
  const [products, setProducts] = useState(fallbackProducts);
  const [quickView, setQuickView] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heartBurstId, setHeartBurstId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef({});

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/products?limit=4`);
        const data = await res.json();
        const fetched = Array.isArray(data.products) ? data.products : [];
        if (!fetched.length) return;

        const formatted = fetched.map((p) => {
          const base = Number(p.price) || 0;
          const sale = p.sale_price ?? null;
          const final = sale ?? base;
          const discount =
            sale && base
              ? `-${Math.round(((base - sale) / base) * 100)}%`
              : "-0%";

          const imgs = Array.isArray(p.images) ? p.images : [];
          const imgUrls = imgs.map((img) =>
            img?.url?.startsWith("http")
              ? img.url
              : `${backendUrl}/${(img?.url || "").replace(/^\/+/, "")}`
          );
          const mainImg = imgUrls[0] || lsBelt;

          return {
            id: p._id,
            title: p.name,
            price: `₹${final.toLocaleString()}`,
            img: mainImg,
            discount,
            rating: Math.round(p.average_rating || 4),
            reviews: p.total_reviews || 0,
            thumbs: imgUrls.length ? imgUrls : [mainImg],
            _raw: p,
          };
        });

        setProducts(formatted);
      } catch {
        console.error("Error fetching featured products");
      }
    };
    fetchProducts();
  }, []);

  // Wishlist persistence
  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    } catch {
      setWishlist([]);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  const isWishlisted = (id) => wishlist.includes(id);
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id))
        return prev.filter((pid) => pid !== product.id);
      triggerHeartBurst(product.id);
      toast.success("Added to wishlist");
      return [...prev, product.id];
    });
  };

  const triggerHeartBurst = (id) => {
    setHeartBurstId(id);
    setTimeout(() => setHeartBurstId(null), 900);
  };

  // Block scroll when modal open
  useEffect(() => {
    document.body.style.overflow = quickView ? "hidden" : "";
  }, [quickView]);

  // Modal keyboard access
  useEffect(() => {
    if (!quickView) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setQuickView(null);
      if (e.key === "ArrowLeft") setSelectedIndex((s) => Math.max(0, s - 1));
      if (e.key === "ArrowRight")
        setSelectedIndex((s) =>
          Math.min((quickView.thumbs?.length || 1) - 1, s + 1)
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [quickView]);

  // 3D hover motion
  const handleMove = (e, id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 12;
    const rotX = (0.5 - py) * 10;
    el.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };
  const handleLeave = (id) => {
    const el = cardRefs.current[id];
    if (el) el.style.transform = "";
  };

  // Add to Cart
  const addToCart = (product) => {
    const raw = product._raw || {};
    const price =
      raw.sale_price ??
      raw.price ??
      Number(product.price.replace(/[₹,]/g, "") || 0);

    const item = {
      productId: raw._id || product.id,
      name: raw.name || product.title,
      quantity: 1,
      price,
      image: product.img,
      color: raw.colors?.[0]?.color || null,
      size:
        raw.colors?.[0]?.sizes?.[0]?.size ||
        raw.variants?.[0]?.size ||
        null,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  // Soft autoplay card highlight
  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(
      () => setActiveIndex((i) => (i + 1) % products.length),
      4000
    );
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <>
      <Toaster position="top-right" />

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, index) => (
              <div key={p.id} className="relative">
                <div
                  ref={(el) => (cardRefs.current[p.id] = el)}
                  onMouseMove={(e) => handleMove(e, p.id)}
                  onMouseLeave={() => handleLeave(p.id)}
                  onClick={(e) => e.stopPropagation()}
                  className={`group relative w-full h-[420px] lg:h-[480px] rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl overflow-hidden transition-transform duration-500 cursor-pointer ${
                    index === activeIndex
                      ? "ring-2 ring-green-400 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                      : ""
                  }`}
                >
                  {/* badge */}
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

                  {/* heart burst */}
                  {heartBurstId === p.id && (
                    <div className="absolute top-6 right-6 z-40">
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

                  {/* card image */}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="fp-image w-full h-full object-cover transition-transform duration-700"
                  />

                  {/* quick actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-3 z-40 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-300">
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
                    >
                      {isWishlisted(p.id) ? (
                        <AiFillHeart className="text-red-500" size={18} />
                      ) : (
                        <AiOutlineHeart className="text-gray-800" size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => setQuickView(p)}
                      className="bg-white p-3 rounded-full shadow hover:scale-110 transition"
                    >
                      <AiOutlineEye className="text-gray-800" size={18} />
                    </button>
                  </div>

                  {/* GLASS BOTTOM LABEL */}
                  <div className="absolute left-3 right-3 bottom-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 group-hover:bg-white/30 transition-all duration-300">

                    {/* PRODUCT NAME + PRICE */}
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold text-black drop-shadow-md truncate">
                        {p.title}
                      </h3>

                      {/* PRICE WITH SALE PRICE IF EXISTS */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-700 font-bold text-lg">
                          ₹{p._raw?.sale_price ?? p._raw?.price ?? p.price}
                        </span>

                        {p._raw?.sale_price && (
                          <span className="text-red-700 line-through text-sm font-medium">
                            ₹{p._raw?.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ADD TO CART BUTTON */}
                    <button
                      onClick={() => addToCart(p)}
                      className="min-w-[38px] min-h-[38px] bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white p-2 rounded-full shadow hover:scale-110 transition"
                      title="Add to cart"
                    >
                      <AiOutlineShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== QUICK VIEW MODAL =================== */}
      {quickView && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.36 }}
            className="bg-white/6 backdrop-blur-xl shadow-2xl w-full max-w-[980px] h-[820px] rounded-3xl overflow-hidden relative"
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickView(null);
            }}
          >
            <div className="h-full grid grid-rows-[65%_auto]">
              {/* Main image */}
              <div className="px-6 pt-6">
                <div className="rounded-xl overflow-hidden w-full h-full shadow-inner">
                  <img
                    src={
                      quickView.thumbs?.[selectedIndex] || quickView.img || lsBelt
                    }
                    alt={quickView.title}
                    className="w-full h-full object-cover"
                    onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                    style={{ opacity: 0, transition: "opacity .25s" }}
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="px-6 pb-6">
                <div className="w-full max-w-[860px] mx-auto flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {(quickView.thumbs || [quickView.img]).map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        selectedIndex === i
                          ? "border-green-600 scale-105"
                          : "border-transparent"
                      } transition duration-300`}
                      style={{ width: 110, height: 70 }}
                    >
                      <img
                        src={t || lsBelt}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="absolute top-8 right-8 w-80 bg-white/8 backdrop-blur-md p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-white/95">
                  {quickView.title}
                </h3>
                <button
                  onClick={() => setQuickView(null)}
                  className="text-white/90 hover:text-white"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              {/* GLASS DESCRIPTION RIBBON (REPLACES REVIEWS) */}
              <div className="mt-3 bg-white/15 backdrop-blur-xl text-white/90 text-sm px-3 py-2 rounded-lg border border-white/25 shadow">
                {quickView._raw?.short_description ||
                  quickView._raw?.description?.split(".")[0] ||
                  "Enhances comfort, stability & daily mobility."}
              </div>

              <div className="mt-4">
                <div className="text-2xl font-extrabold text-green-400">
                  {quickView.price}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                    onClick={() => addToCart(quickView)}
                  >
                    Add to Cart
                    <AiOutlineShoppingCart />
                  </button>

                  <button
                    onClick={() =>
                      window.location.assign(`/product/${quickView.id}`)
                    }
                    className="px-4 py-2 rounded-full border border-white/10 text-white/90 hover:bg-white/6 transition"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fp-image { transform-origin: center; will-change: transform; }
        .fp-shine { transition: background 220ms linear; }
      `}</style>
    </>
  );
}
