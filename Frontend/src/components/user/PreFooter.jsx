import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Use uploaded images directly
const images = [
  {
    id: 1,
    src: "/mnt/data/Screenshot 2025-11-23 at 4.50.18 AM.png",
    alt: "Stretch exercise",
  },
  {
    id: 2,
    src: "/mnt/data/Screenshot 2025-11-21 134354.png",
    alt: "Workout session",
  },
  {
    id: 3,
    src: "/mnt/data/Screenshot 2025-11-21 134354.png",
    alt: "Young boy training",
  },
  {
    id: 4,
    src: "/mnt/data/Screenshot 2025-11-21 134354.png",
    alt: "Man exercising",
  },
];

export default function PreHeadingGallery() {
  return (
    <section aria-label="Top gallery" className="relative w-full py-10">

      {/* ================= IMAGE STRIP ================= */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">

        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 40, scale: 1.03 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.18, ease: "easeOut" }}
            className="relative group overflow-hidden"
          >

            {/* IMAGE */}
            <motion.img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="
                w-full 
                h-[320px] sm:h-[350px] md:h-[400px] lg:h-[420px] 
                object-cover transition-all duration-700
                group-hover:scale-110
              "
            />

            {/* Hover Gradient Overlay */}
            <div
              className="
                absolute inset-0 
                bg-gradient-to-br from-[#2F86D6]/20 via-[#63B46B]/20 to-transparent
                opacity-0 group-hover:opacity-100
                transition-all duration-500
              "
            />

            {/* Subtle Fade at Bottom for Depth */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* ================= CENTER BUTTON ================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.a
          href="/product"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="
            pointer-events-auto 
            px-9 py-4 rounded-full text-lg font-semibold 
            text-white backdrop-blur-xl
            bg-gradient-to-r from-[#2F86D6] to-[#63B46B]
            shadow-[0_8px_25px_rgba(0,0,0,0.25)]
            hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
            active:scale-95
            transition-all duration-300
            flex items-center gap-2
          "
        >
          Shop Now
        </motion.a>
      </div>
    </section>
  );
}
