import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import lsBelt from "../../assets/Frontend_assets/curewrap/lsBelt.png";

const backendUrl = "";

export default function HeroSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/users/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const getProduct = (productId) =>
    products.find((p) => p._id === productId || p.id === productId);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-4 md:px-12 overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      <div className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] items-center gap-8 mx-auto">

        {/* LEFT */}
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
            href="/product"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 md:px-12 py-3.5 md:py-4 bg-green-600 text-white text-base md:text-lg font-semibold rounded-full shadow-lg tracking-wide transition-all duration-300"
          >
            Explore Products
          </motion.a>
        </motion.div>

        {/* RIGHT IMAGE + HOTSPOTS */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative flex justify-center md:justify-end pr-0 md:pr-2 lg:pr-4 overflow-visible"
        >
          <motion.img
            src={assets.girl}
            alt="Hero Model"
            className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[1250px] h-auto object-contain drop-shadow-2xl brightness-110 contrast-110 scale-[1.02] sm:scale-[1.06] md:scale-[1.15] lg:scale-[1.22]"
          />

          {/* HOTSPOTS (desktop & tablet position remains same) */}
<Hotspot
  ids={[
    "6929aef0b6489355ea3c5a25", // LS Contoured Lumbar Belt
    "6929c183b6489355ea3c6b21"  // Second product
  ]}
  p_name="LS Contoured Lumbar Belt"
  getProduct={getProduct}
  top="58%"
  left="6%"
/>

          <Hotspot id="6932ab49ac77b4f2a0ad736e" p_name="Posture Corrector Belt" getProduct={getProduct} top="43%" left="11%" />
          <Hotspot id="69270418d8a75f130faf4d66" p_name="Hinged Knee" getProduct={getProduct} top="85%" left="0%" />
          <Hotspot id="692711b3c97c569366415213" p_name="Knee Brace" getProduct={getProduct} top="83%" left="60%" />
        
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   HOTSPOT COMPONENT — Button removed in mobile only
------------------------------------------------------------------ */
function Hotspot({ top, left, id, ids, getProduct, p_name }) {
  const [show, setShow] = useState(false);

  // ✅ SUPPORT SINGLE ID OR MULTIPLE IDS
  const WAIST_IDS = [
  "6929aef0b6489355ea3c5a25",
  "6929c183b6489355ea3c6b21",
];

const isWaist =
  ids?.some((pid) => WAIST_IDS.includes(pid)) ||
  WAIST_IDS.includes(id);

  const productList = ids
    ? ids.map((pid) => getProduct(pid)).filter(Boolean)
    : id
    ? [getProduct(id)].filter(Boolean)
    : [];

  if (productList.length === 0) return null;

  const side = parseFloat(left) > 50 ? "left" : "right";

  return (
    <div
      className="absolute"
     style={{
  top: isWaist ? `calc(${top} + 30px)` : top,
  left,
}}

      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* HOTSPOT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.25 }}
        className="
        
          hidden sm:flex
          w-8 h-8
          rounded-full
          items-center justify-center
          bg-white/40
          backdrop-blur-xl
          border-[3px] border-white/80
          animate-pulse
        "
      >
        <span className="text-green-700 text-xl font-extrabold">+</span>
      </motion.button>

      {/* POPUP */}
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`hidden md:flex absolute bg-white w-[340px] rounded-2xl shadow-2xl
          border border-gray-200 p-4 gap-3 z-50 flex-col
          top-[50%] -translate-y-1/2
          ${side === "left" ? "-left-[360px]" : "left-[55px]"}`}
        >
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            {p_name}
          </h3>

          {productList.map((product) => {
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
                key={product._id}
                className="flex gap-3 items-center border rounded-xl p-2"
              >
                <img
                  src={img}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-green-600 font-bold text-sm">
                    {price}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="inline-block mt-1 px-3 py-1 text-[11px]
                    bg-green-600 text-white rounded-full hover:bg-green-700"
                  >
                    VIEW PRODUCT
                  </Link>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
