// FeaturedProductsCinematicSquareModal.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart, AiOutlineEye, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { assets } from "../../assets/frontend_assets/assets.js";

// Use the developer-provided uploaded image as starter thumbnail
const uploadedImg = "/mnt/data/Screenshot 2025-11-23 at 4.50.18 AM.png";

const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

// Add uploaded thumbnails to these arrays when you upload more images
const products = [
  { id: 1, title: "Curewrap Compression Knee Sleeves", price: "₹25.00", img: assets.product1, discount: "-18%", rating: 5, reviews: 6066, thumbs: [assets.product1, assets.product2, assets.product3, uploadedImg] },
  { id: 2, title: "Curewrap Adjustable Knee Brace", price: "₹35.00", img: assets.product2, discount: "-7%", rating: 3, reviews: 112, thumbs: [assets.product2, assets.product1, assets.product3, uploadedImg] },
  { id: 3, title: "Curewrap Foot & Ankle Brace Support", price: "₹40.00", img: assets.product3, discount: "-16%", rating: 4, reviews: 441, thumbs: [assets.product3, assets.product1, assets.product4, uploadedImg] },
  { id: 4, title: "Curewrap Reinforced Back Brace", price: "₹50.00", img: assets.product4, discount: "-25%", rating: 4, reviews: 892, thumbs: [assets.product4, assets.product2, assets.product1, uploadedImg] },
];

export default function FeaturedProductsCinematicSquareModal() {
  const [quickView, setQuickView] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // index in quickView.thumbs
  const [heartBurstId, setHeartBurstId] = useState(null);
  const cardRefs = useRef({});

  // prevent background scroll while modal open
  useEffect(() => {
    if (quickView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
        setSelectedIndex((s) => Math.min(quickView.thumbs.length - 1, s + 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [quickView]);

  // heart burst
  const triggerHeartBurst = (id) => {
    setHeartBurstId(id);
    setTimeout(() => setHeartBurstId(null), 900);
  };

  // tilt / pointer movement handler (same hybrid cinematic behavior)
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
    if (img) img.style.transform = `translateZ(30px) scale(1.06) translate(${(px - 0.5) * 8}px, ${(py - 0.5) * 6}px)`;
    if (shine) shine.style.background = `linear-gradient(135deg, rgba(255,255,255,${0.12 + px * 0.18}) 0%, rgba(255,255,255,0) 40%)`;
    if (badge) badge.style.transform = `translateZ(60px) translate(${(px - 0.5) * 10}px, ${(py - 0.5) * -6}px)`;
  };

  const handleLeave = (id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const img = el.querySelector(".fp-image");
    const shine = el.querySelector(".fp-shine");
    const badge = el.querySelector(".fp-badge");
    el.style.transform = `perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
    if (img) img.style.transform = `translateZ(0) scale(1) translate(0,0)`;
    if (shine) shine.style.background = `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)`;
    if (badge) badge.style.transform = `translateZ(0) translate(0,0)`;
  };

  // open quick view and default selected index
  const openQuickView = (product) => {
    setQuickView(product);
    setSelectedIndex(0);
  };

  return (
    <>
      <section className="py-14 md:py-20 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Featured Products</h2>
              <p className="text-sm text-gray-500 mt-1">Hand-picked top-rated support essentials</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Keep your custom arrows or let the Swiper provide them; for this component you may wire these up to Swiper navigation if needed */}
              <div className="text-sm text-gray-500">Premium selection</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="relative">
                <div
                  ref={(el) => (cardRefs.current[p.id] = el)}
                  onMouseMove={(e) => handleMove(e, p.id)}
                  onMouseLeave={() => handleLeave(p.id)}
                  className="relative w-full h-[420px] lg:h-[480px] rounded-2xl bg-white/30 backdrop-blur-md shadow-2xl overflow-hidden transition-transform duration-500"
                  style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

                  {/* badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="fp-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: `linear-gradient(90deg, ${brandBlue}, ${brandGreen})`, boxShadow: "0 6px 26px rgba(0,0,0,0.18)" }}>
                      {p.discount}
                    </div>
                  </div>

                  {/* heart burst */}
                  {heartBurstId === p.id && (
                    <div className="absolute top-6 right-6 z-40 pointer-events-none">
                      <motion.div initial={{ scale: 0, y: 0, opacity: 1 }} animate={{ scale: 1.6, y: -36, opacity: 0 }} transition={{ duration: 0.9 }} className="text-red-500">
                        <AiFillHeart size={30} />
                      </motion.div>
                    </div>
                  )}

                  {/* image layer */}
                  <div className="absolute inset-0 flex items-start justify-center p-6">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <img src={p.img} alt={p.title} loading="lazy" className="fp-image w-full h-full object-cover transition-transform duration-700" />
                      <div className="fp-shine absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0))" }} />

                      {/* quick actions (visible on hover) */}
                      <div className="absolute top-4 right-4 flex flex-col gap-3 z-40 opacity-0 scale-95 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => triggerHeartBurst(p.id)} className="bg-white p-3 rounded-full shadow hover:scale-110 transition" title="Add to wishlist">
                          <AiOutlineHeart className="text-gray-800" size={18} />
                        </button>

                        <button onClick={() => openQuickView(p)} className="bg-white p-3 rounded-full shadow hover:scale-110 transition" title="Quick view">
                          <AiOutlineEye className="text-gray-800" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* bottom info */}
                  <div className="absolute left-0 right-0 bottom-0 p-6 z-40">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{p.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: p.rating }).map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                          </div>
                          <span className="text-sm text-gray-500">({p.reviews})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-green-600 font-extrabold text-2xl">{p.price}</div>
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
        </div>
      </section>

      {/* =================== SQUARE MODAL (Option C) =================== */}
      {quickView && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.36 }}
            className="bg-white/6 backdrop-blur-xl shadow-2xl w-full max-w-[980px] h-[820px] rounded-3xl overflow-hidden relative"
            role="dialog"
            aria-modal="true"
            aria-label={`${quickView.title} quick view`}
            onClick={(e) => {
              // close if backdrop clicked (but not if clicking inside content)
              if (e.target === e.currentTarget) setQuickView(null);
            }}
          >
            {/* Left: Main image (takes ~65% of height) */}
            <div className="h-full grid grid-rows-[65%_auto]">
              <div className="px-6 pt-6">
                <div className="rounded-xl overflow-hidden w-full h-full shadow-inner">
                  <img
                    src={quickView.thumbs[selectedIndex] || quickView.img}
                    alt={quickView.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onLoad={(e) => { e.currentTarget.style.opacity = 1; }}
                    style={{ opacity: 0, transition: "opacity 260ms ease-in" }}
                  />
                </div>
              </div>

              {/* Thumbnail ribbon */}
              <div className="px-6 pb-6">
                <div className="w-full flex items-center justify-center">
                  <div className="w-full max-w-[860px]">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                      {quickView.thumbs.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIndex(i)}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedIndex === i ? "border-green-600 scale-105" : "border-transparent"} transition-transform duration-300`}
                          style={{ width: 110, height: 70 }}
                        >
                          <img src={t} alt={`thumb-${i}`} loading="lazy" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right-side overlay panel (floating info box) */}
            <div className="absolute top-8 right-8 w-80 bg-white/8 backdrop-blur-md p-4 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-white/95">{quickView.title}</h3>
                <button onClick={() => setQuickView(null)} className="text-white/90 hover:text-white" aria-label="Close">
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {Array.from({ length: quickView.rating }).map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                <span className="text-sm text-white/80">({quickView.reviews} reviews)</span>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-extrabold text-green-400">{quickView.price}</div>
                <p className="text-sm text-white/80 mt-2">Comfortable, breathable, and engineered for everyday support.</p>

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
                  <img src={uploadedImg} alt="logo" className="w-8 h-8 rounded-md object-contain" />
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
        /* helper: hide default scrollbar for the thumbnail ribbon */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* cinematic helpers */
        .fp-image { transform-origin: center; will-change: transform; }
        .fp-shine { transition: background 220ms linear; }

        /* heart float (fallback class) */
        @keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-48px) scale(1.6); opacity: 0; } }
        .animate-floatUp { animation: floatUp 0.9s ease forwards; }

        /* make modal more glassy on small screens */
        @media (max-width: 1024px) {
          .backdrop-blur-xl { backdrop-filter: blur(8px); }
        }
      `}</style>
    </>
  );
}
