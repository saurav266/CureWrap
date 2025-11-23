import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

// Animation Variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ProductSection({ products = [] }) {
  const [quickView, setQuickView] = useState(null);
  const [animateHeart, setAnimateHeart] = useState(null);

  return (
    <>
      <section className="py-16 px-6 md:px-12 bg-white font-productBody">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-14 font-productTitle">
            OUR PRODUCTS
          </h2>

          {/* Animated Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={cardAnimation}
                className="relative bg-white shadow-md hover:shadow-xl transition p-3 pb-5 overflow-hidden"
              >

                {/* Discount Badge */}
                {p.discount && (
                  <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full font-productBody">
                    {p.discount}
                  </div>
                )}

                {/* Floating Heart Animation */}
                {animateHeart === p.id && (
                  <AiFillHeart className="text-red-500 text-4xl absolute top-8 right-10 animate-floatUp opacity-0" />
                )}

                {/* IMAGE AREA */}
                <div className="relative w-full h-[330px] overflow-hidden group">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover Action Icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-3 opacity-0 translate-y-2 
                    group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">

                    {/* Wishlist */}
                    <div className="relative group/icon">
                      <button
                        onClick={() => {
                          setAnimateHeart(p.id);
                          setTimeout(() => setAnimateHeart(null), 800);
                        }}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                      >
                        <AiOutlineHeart size={24} className="text-gray-800" />
                      </button>

                      {/* Tooltip */}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                        bg-white shadow px-2 py-1 rounded text-xs opacity-0 font-productBody
                        group-hover/icon:opacity-100 transition whitespace-nowrap">
                        Add to Wishlist
                      </span>
                    </div>

                    {/* Quick View */}
                    <div className="relative group/icon">
                      <button
                        onClick={() => setQuickView(p)}
                        className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                      >
                        <AiOutlineEye size={24} className="text-gray-800" />
                      </button>

                      {/* Tooltip */}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                        bg-white shadow px-2 py-1 rounded text-xs opacity-0 font-productBody 
                        group-hover/icon:opacity-100 transition whitespace-nowrap">
                        Quick View
                      </span>
                    </div>

                  </div>
                </div>

                {/* RATING */}
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: p.rating || 0 }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                  {p.reviews && (
                    <span className="text-sm text-gray-500 ml-1 font-productBody">({p.reviews})</span>
                  )}
                </div>

                {/* TITLE */}
                <h3 className="font-productTitle text-gray-800 text-lg mt-1 font-semibold">
                  {p.title}
                </h3>

                {/* PRICE */}
                <p className="font-productPrice text-green-600 font-bold text-xl mt-2">
                  {p.price}
                </p>

                {/* SHOP NOW */}
                <button className="mt-3 w-full py-2 rounded-full border border-green-600 
                  text-green-600 font-semibold hover:bg-green-600 hover:text-white transition font-productBody">
                  <AiOutlineShoppingCart size={22} className="inline mr-2" /> SHOP NOW
                </button>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

