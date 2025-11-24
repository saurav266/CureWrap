import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/frontend_assets/assets.js";
import { FaPlus } from "react-icons/fa";

const HeroSection = () => {

  // Reusable Hotspot Button Component
  const Hotspot = ({ top, left, label }) => (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.2 }}
      className="absolute z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-teal-500 text-white rounded-full shadow-xl ring-4 ring-white/50 cursor-pointer"
      style={{ top: top, left: left }}
      title={label} // Shows text when hovering
    >
      <FaPlus className="text-sm md:text-lg" />
    </motion.button>
  );

  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-6 md:px-12 overflow-hidden">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      {/* Main Grid Container */}
      <div className="relative max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-10 items-center gap-8 mx-auto">

        {/* --- LEFT SIDE (Text) 30% --- */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10 md:col-span-3"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Stay Safe. <br />
            <span className="text-green-600">Stay Aware.</span>
          </h1>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Protect yourself from phishing attacks with real-time detection,
            awareness training, and tools designed to keep you safe online.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <motion.a
              href="#products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg text-center transition-all duration-300"
            >
              Explore
            </motion.a>
          </div>
        </motion.div>

        {/* --- RIGHT SIDE (Image + Hotspots) 70% --- */}
        <motion.div
          initial={{ opacity: 0, x: 120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center md:justify-end md:col-span-7"
        >
          {/* Wrapper Div for positioning hotspots relative to the image */}
          <div className="relative w-full max-w-[900px]">
            
            {/* 1. The Image */}
            <motion.img
              src={assets.girl}
              alt="Cyber Safety"
              className="w-full h-auto object-contain drop-shadow-2xl brightness-110 contrast-110 select-none"
              whileHover={{ scale: 1.02 }}
            />

            {/* 2. The Hotspots (Adjust percentages to fit your image) */}
            
            {/* Shoulder (Approx: Top Left area) */}
            <Hotspot top="25%" left="35%" label="Shoulder" />

            {/* Waist (Approx: Middle Left area) */}
            <Hotspot top="55%" left="28%" label="Waist" />

            {/* Knee (Approx: Middle Right area) */}
            <Hotspot top="65%" left="60%" label="Knee" />

            {/* Feet (Approx: Bottom Right area) */}
            <Hotspot top="82%" left="85%" label="Feet" />

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;