import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import lsBelt from "../../assets/Frontend_assets/curewrap/lsBelt.png";

const backendUrl = "http://localhost:8000";

export default function HeroSection() {
  const [products, setProducts] = useState([]);

  // Fetch all products once
  useEffect(() => {
    fetch(`${backendUrl}/api/users/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  // Helper to get product by name
  const getProduct = (keyword) => {
    return products.find((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-4 md:px-12 overflow-x-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      <div className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] items-center gap-8 mx-auto">
        
        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10 pl-1 md:pl-10 lg:pl-14 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
            Stay Safe. <span className="text-green-600">Stay Aware.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-700 max-w-lg mx-auto md:mx-0">
            Protect yourself from phishing attacks with real-time detection,
            awareness training, and tools designed to keep you safe online.
          </p>

          <motion.a
            href="/products"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 md:px-12 py-3.5 md:py-4 bg-green-600 text-white text-base md:text-lg font-semibold rounded-full shadow-lg tracking-wide transition-all duration-300"
          >
            Explore Products
          </motion.a>
        </motion.div>

        {/* RIGHT IMAGE WITH HOTSPOTS */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative flex justify-center md:justify-end pr-0 md:pr-2 lg:pr-4 overflow-visible"
        >
          <motion.img
            src={assets.girl}
            alt="Hero Model"
            className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[1250px] h-auto object-contain drop-shadow-2xl brightness-110 contrast-110 scale-[1.02] sm:scale-[1.06] md:scale-[1.15] lg:scale-[1.22] translate-x-0 md:translate-x-[20px] lg:translate-x-[40px]"
          />

          {/* HOTSPOTS WITH BACKEND MATCH */}
          <Hotspot keyword="LS LUMBUR BELT" getProduct={getProduct} top="64%" left="10%" />
          <Hotspot keyword="LS Contoured Belt" getProduct={getProduct} top="38%" left="18%" />
          <Hotspot keyword="Hinge Knee" getProduct={getProduct} top="93%" left="5%" />
          <Hotspot keyword="Knee Brace" getProduct={getProduct} top="87%" left="65%" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   HOTSPOT COMPONENT (BACKEND DRIVEN)
------------------------------------------------------------------ */
function Hotspot({ top, left, keyword, getProduct }) {
  const [show, setShow] = useState(false);
  const product = getProduct(keyword);

  const leftValue = parseFloat(left);
  const side = leftValue > 50 ? "left" : "right";

  const img = product?.images?.[0]?.url
    ? product.images[0].url.startsWith("http")
      ? product.images[0].url
      : `${backendUrl}/${product.images[0].url}`
    : lsBelt;

  const price = product?.sale_price
    ? `₹${product.sale_price.toLocaleString()}`
    : `₹${product?.price?.toLocaleString()}`;

  return (
    <div
      className="absolute"
      style={{ top, left }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <motion.button
        whileHover={{ scale: 1.25 }}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-xl border-[3px] border-white/80 animate-pulse"
      >
        <span className="text-green-700 text-xl font-extrabold">+</span>
      </motion.button>

      {show && product && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`hidden md:flex absolute bg-white w-[300px] rounded-2xl shadow-2xl border border-gray-200 p-4 gap-4 z-50
            top-[50%] -translate-y-1/2
            ${side === "left" ? "-left-[320px]" : "left-[55px]"}`}
        >
          {/* Pointer */}
          {side === "left" ? (
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[12px] border-transparent border-l-white" />
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[12px] border-transparent border-r-white" />
          )}

          <img src={img} className="w-24 h-24 object-cover rounded-xl border border-gray-200" />

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
            <p className="text-green-600 font-bold mt-1">{price}</p>

            <Link
              to={`/product/${product._id}`}
              className="mt-2 px-4 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              VIEW PRODUCT
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
