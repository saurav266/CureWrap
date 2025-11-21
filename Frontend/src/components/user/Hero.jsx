import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/frontend_assets/assets.js";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-6 md:px-12">
      {/* Background gradient very similar to Modvel */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      <div className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10"
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
            <motion.a
              href="#learn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* Right Image */}
 <motion.div
  initial={{ opacity: 0, x: 250 }}   // farther RIGHT
  animate={{ opacity: 1, x: 0 }}     // slide to center
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="flex justify-end"
>
  <motion.img
    src={assets.girl}
    alt="Hero Girl"
    className="
      w-[1800px] md:w-[1400px] lg:w-[1600px]
      object-contain
      drop-shadow-2xl
      brightness-110
      contrast-110
      select-none
      transition-all duration-500
    "
    whileHover={{ scale: 1.06 }}
  />
</motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
