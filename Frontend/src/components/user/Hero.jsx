import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";

/* ------------------------------------------------------------------
   HERO SECTION (PREMIUM VERSION)
------------------------------------------------------------------ */
export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-4 md:px-12 overflow-x-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      {/* Layout Grid */}
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

          {/* CTA */}
          <motion.a
            href="/products"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 md:px-12 py-3.5 md:py-4 bg-green-600 text-white text-base md:text-lg font-semibold rounded-full shadow-lg tracking-wide transition-all duration-300"
          >
            Explore Products
          </motion.a>
        </motion.div>

        {/* RIGHT — HERO IMAGE + HOTSPOTS */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="
            relative flex justify-center md:justify-end
            pr-0 md:pr-2 lg:pr-4
            overflow-visible
          "
        >
          <motion.img
            src={assets.girl}
            alt="Hero Model"
            className="
              w-full max-w-[420px] sm:max-w-[480px] md:max-w-[1250px]
              h-auto object-contain drop-shadow-2xl brightness-110 contrast-110

              scale-[1.02] sm:scale-[1.06]
              md:scale-[1.15] lg:scale-[1.22]

              translate-x-0
              md:translate-x-[20px] lg:translate-x-[40px]
            "
          />

          {/* HOTSPOTS */}
          <Hotspot 
            id="back-support"
            top="64%" 
            left="10%" 
            title="BACK BELT SUPPORT" 
            price="₹39.95"
            productId="back-support"
            img={assets.product1}
          />

          <Hotspot 
            id="back-wear"
            top="38%" 
            left="18%" 
            title="ELBOW WEAR" 
            price="₹29.95"
            productId="elbow-wear"
            img={assets.product2}
          />

          <Hotspot 
            id="hinge-knee"
            top="93%" 
            left="5%" 
            title="KNEE CAP" 
            price="₹29.95"
            productId="knee-cap"
            img={assets.product3}
          />

          <Hotspot 
            id="knee-wear"
            top="87%" 
            left="65%" 
            title="ANKLE WEAR" 
            price="₹95.95"
            productId="ankle-wear"
            img={assets.product4}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   PREMIUM HOTSPOT WITH GLASS BUTTON + NAVIGATION
------------------------------------------------------------------ */
function Hotspot({ top, left, title, price, img, productId }) {
  const [show, setShow] = useState(false);

  const leftValue = parseFloat(left);
  const cardSide = leftValue > 50 ? "left" : "right";

  return (
    <div
      className="absolute"
      style={{ top, left }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <motion.button
        whileHover={{ scale: 1.25 }}
        className="
          hotspot-ring relative
          w-8 h-8 rounded-full
          flex items-center justify-center

          bg-white/40 backdrop-blur-xl
          border-[3px] border-white/80

          animate-[breathingGlowTriColor_3.8s_ease-in-out_infinite]

          transition-all duration-300
          z-20
        "
      >
        <span className="text-green-700 text-xl font-extrabold">+</span>
      </motion.button>

      {/* PRODUCT CARD */}
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`
            hidden md:flex
            absolute
            bg-white w-[300px]
            rounded-2xl shadow-2xl border border-gray-200 p-4 gap-4 z-50
            top-[50%] -translate-y-1/2
            ${cardSide === "left" ? "-left-[320px]" : "left-[55px]"}
          `}
        >
          {/* ARROW */}
          {cardSide === "left" ? (
            <div className="absolute top-1/2 -translate-y-1/2 -right-3
                            w-0 h-0 border-t-[10px] border-b-[10px] border-l-[12px]
                            border-t-transparent border-b-transparent border-l-white" />
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 -left-3
                            w-0 h-0 border-t-[10px] border-b-[10px] border-r-[12px]
                            border-t-transparent border-b-transparent border-r-white" />
          )}

          {/* PRODUCT IMAGE */}
          <img
            src={img}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-xl border border-gray-200"
          />

          {/* CONTENT */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-green-600 font-bold mt-1">{price}</p>

            <Link
              to={`/product/${productId}`}
              className="
                mt-2 px-4 py-1.5 text-xs font-semibold
                bg-green-600 text-white rounded-full
                hover:bg-green-700 transition
              "
            >
              VIEW PRODUCT
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
