import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/frontend_assets/assets.js";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-6 md:px-12">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      {/* Grid: text 40% / image 60% */}
      <div className="
        relative max-w-7xl w-full 
        grid grid-cols-1 md:grid-cols-[0.42fr_0.58fr] 
        items-center 
        gap-10
      ">

        {/* LEFT TEXT with more left-side spacing */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10 pl-6 md:pl-10 lg:pl-16"   // ← MORE LEFT GAP
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Stay Safe. <span className="text-green-600">Stay Aware.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-lg">
            Protect yourself from phishing attacks with real-time detection,
            awareness training, and tools designed to keep you safe online.
          </p>

          <div className="flex gap-4 pt-2">
            <motion.a
              href="#products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Explore Products
            </motion.a>
          </div>
        </motion.div>

        <motion.div
  initial={{ opacity: 0, x: 130 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1.1, ease: "easeOut" }}
  className="flex justify-end pr-0 md:pr-4 lg:pr-6" // ← REDUCED RIGHT PADDING
>
  <motion.img
    src={assets.girl}
    alt="Hero Girl"
    className="
      w-full
      max-w-[1500px]
      h-auto
      object-contain
      drop-shadow-2xl
      brightness-110
      contrast-110
      select-none
      transition-all duration-500
      scale-[1.25] md:scale-[1.32]   /* ← BIGGER SCALE */
    "
  />
  {/* HOTSPOT 1 — SHOULDER */}
  <button
    className="absolute top-[38%] left-[53%] w-10 h-10 bg-white 
               rounded-full shadow-xl flex items-center justify-center 
               text-green-600 font-bold text-2xl hover:scale-110 transition"
  >
    +
  </button>

  {/* HOTSPOT 2 — ELBOW */}
  <button
    className="absolute top-[52%] left-[63%] w-10 h-10 bg-white 
               rounded-full shadow-xl flex items-center justify-center 
               text-green-600 font-bold text-2xl hover:scale-110 transition"
  >
    +
  </button>

  {/* HOTSPOT 3 — BACK KNEE */}
  <button
    className="absolute top-[70%] left-[43%] w-10 h-10 bg-white 
               rounded-full shadow-xl flex items-center justify-center 
               text-green-600 font-bold text-2xl hover:scale-110 transition"
  >
    +
  </button>

  {/* HOTSPOT 4 — FRONT FOOT */}
  <button
    className="absolute top-[78%] left-[77%] w-10 h-10 bg-white 
               rounded-full shadow-xl flex items-center justify-center 
               text-green-600 font-bold text-2xl hover:scale-110 transition"
  >
    +
  </button>
</motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
