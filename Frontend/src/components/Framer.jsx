import React from "react";
import { motion } from "framer-motion";

import knee from "../assets/knee_1.webp";
import back from "../assets/back_brace.avif";
import ankle from "../assets/image_4.2.webp";
import cushion from "../assets/seat_cushions.webp";
import wrist from "../assets/wrist.jpg";  // NEW wrist image added

export default function UltimateSupportSection() {
  const thumbnails = [
    { img: wrist, label: "Wrist Support", link: "/products/wrist-support" }, // UPDATED
    { img: back, label: "Back Support", link: "/products/back-support" },
    { img: ankle, label: "Ankle Stability", link: "/products/ankle-support" },
    { img: cushion, label: "Comfort", link: "/products/cushions" },
  ];

  return (
    <section className="bg-gray-50 py-12 px-4 md:px-8 lg:px-10">
      
      {/* TEXT HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Ultimate Support You Need
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto line-clamp-2">

         We provide high-quality medical-grade orthopedic wear designed to offer you the support, comfort, and pain relief you need. Our wide range of products includes knee braces, back braces, elbow braces, and seat cushions, all designed to enhance your quality of life and help you maintain an active lifestyle.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

        {/* LEFT — LARGE IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[560px] md:h-[640px] lg:h-[720px] 
                     overflow-hidden shadow-lg group"
        >
          <img
            src={knee}
            alt="Knee Support"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* GREEN HOVER OVERLAY */}
          <div className="absolute inset-0 bg-green-600/70 opacity-0 group-hover:opacity-100 transition duration-300"></div>

          {/* LABEL */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
            <p className="text-white text-3xl font-semibold px-5 py-2 rounded-md bg-green-500/40 backdrop-blur-sm">
              Knee Support
            </p>
          </div>

          {/* FIXED BUTTON */}
          <a
            href="/products/knee-support"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 
                       bg-white text-black font-semibold px-30 py-1 
                       rounded-md shadow-md hover:bg-gray-200 transition"
          >
            Knee Support
          </a>
        </motion.div>

        {/* RIGHT — SMALL IMAGES */}
        <div className="grid grid-cols-2 gap-3 h-[560px] md:h-[640px] lg:h-[720px]">

          {thumbnails.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="relative overflow-hidden shadow-md w-full h-full group"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* GREEN HOVER OVERLAY */}
              <div className="absolute inset-0 bg-green-600/70 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              {/* LABEL */}
              <div className="absolute inset-0 flex items-center justify-center 
                              opacity-0 group-hover:opacity-100 transition duration-500">
                <p className="text-white text-xl font-semibold px-4 py-1 rounded-md 
                              bg-green-500/40 backdrop-blur-sm">
                  {item.label}
                </p>
              </div>

              {/* FIXED BUTTON */}
             <a
  href={item.link}
  className="absolute bottom-4 left-1/2 -translate-x-1/2 
             bg-white text-black font-semibold px-10 py-1 
             rounded-md shadow-md hover:bg-gray-200 transition 
             whitespace-nowrap"
>
  {item.label}
</a>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
