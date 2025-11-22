import React, { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/frontend_assets/assets.js";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-6 md:px-12">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-white pointer-events-none" />

      {/* Layout Grid */}
      <div className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-[0.45fr_0.55fr] items-center gap-8">

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10 pl-4 md:pl-10 lg:pl-14"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Stay Safe. <span className="text-green-600">Stay Aware.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-lg">
            Protect yourself from phishing attacks with real-time detection,
            awareness training, and tools designed to keep you safe online.
          </p>

          {/* Improved Explore Button */}
          <motion.a
            href="/products"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-12 py-4 
              bg-green-600 text-white 
              text-lg font-semibold 
              rounded-full shadow-lg 
              tracking-wide
              transition-all duration-300
            "
          >
            Explore Products
          </motion.a>
        </motion.div>

        {/* RIGHT SIDE IMAGE + HOTSPOTS */}
        <motion.div
          initial={{ opacity: 0, x: 130 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative flex justify-end pr-0 md:pr-2 lg:pr-4"
        >
          <motion.img
            src={assets.girl}
            alt="Hero Girl"
            className="
              w-full max-w-[1350px]
              h-auto object-contain
              drop-shadow-2xl brightness-110 contrast-110
              scale-[1.22] md:scale-[1.28]
            "
          />

          {/* HOTSPOTS back*/}
          <Hotspot 
            top="64%" 
            left="2%" 
            title="BACK BELT SUPPORT" 
            price="₹39.95"
            img={assets.product1}
          />
          {/* elbow*/}
          <Hotspot 
            top="58%" 
            left="67%" 
            title="ELBOW WEAR" 
            price="₹29.95"
            img={assets.product2}
          />
          {/* knee*/}
          <Hotspot 
            top="88%" 
            left="-5%" 
            title="KNEE CAP" 
            price="₹29.95"
            img={assets.product3}
          />
          {/* foot*/}
          <Hotspot 
            top="90%" 
            left="83%" 
            title="FOOT WEAR" 
            price="₹95.95"
            img={assets.product4}
          />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;


/* -----------------------------------------------------------
   PREMIUM HOTSPOT — WITH AUTO ARROW DIRECTION
----------------------------------------------------------- */
const Hotspot = ({ top, left, title, price, img }) => {
  const [show, setShow] = useState(false);

  // convert "83%" → numeric 83
  const leftValue = parseFloat(left);

  // hotspot on right → card appears LEFT side
  const cardSide = leftValue > 50 ? "left" : "right";

  return (
    <div
      className="absolute"
      style={{ top, left }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* SUPER PREMIUM GLASS + BUTTON */}
      <button
        className="
          w-10 h-10 rounded-full 
          flex items-center justify-center
          text-white text-xl font-bold

          bg-white/50
          backdrop-blur-[10px]

          border-[3px] border-white/80
          shadow-[0_8px_25px_rgba(0,0,0,0.15),0_0_18px_rgba(0,255,160,0.55)]

          hover:scale-125 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_25px_rgba(0,255,170,0.7)]
          transition-all duration-300
        "
      >
        <span className="text-green-700">+</span>
      </button>

      {/* PRODUCT CARD */}
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            absolute mt-4
            bg-white w-[280px]
            rounded-xl shadow-2xl border border-gray-200 p-4 flex gap-4 z-50 top-[50%] translate-y-[-50%]


            ${cardSide === "left" ? "-left-[300px]" : "left-[50px]"}
          `}
        >
          {/* ARROW POINTER — AUTO SIDE */}
          {cardSide === "left" ? (
            <div
              className="
                absolute 
                top-1/2 -translate-y-1/2
                -right-3
                w-0 h-0
                border-t-[10px] border-b-[10px] border-l-[12px]
                border-t-transparent border-b-transparent border-l-white
              "
            />
          ) : (
            <div
              className="
                absolute 
                top-1/2 -translate-y-1/2
                -left-3
                w-0 h-0
                border-t-[10px] border-b-[10px] border-r-[12px]
                border-t-transparent border-b-transparent border-r-white
              "
            />
          )}


          {/* IMAGE */}
          <img
            src={img}
            alt="product"
            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
          />

          {/* CONTENT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-green-600 font-bold mt-1">{price}</p>

            <button
              className="
                mt-2 px-4 py-1.5 text-xs font-semibold
                bg-green-600 text-white rounded-full
                hover:bg-green-700 transition
              "
            >
              VIEW PRODUCT
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
