import { motion } from "framer-motion";

export default function UltimateSupportSection() {
  return (
    <section className="bg-white py-20 px-4 md:px-10">

      {/* TEXT SECTION */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.h2
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Ultimate Support You Need
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 mt-4"
        >
          Medical-grade orthopedic wear crafted for comfort, stability and pain relief.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-600 mt-3"
        >
          Whether you're recovering, training, or improving mobility — CureWrap supports your movement.
        </motion.p>

        {/* Divider line */}
        <div className="w-24 h-1 bg-green-500 mx-auto mt-6 rounded-full" />
      </div>

      {/* =================== IMAGE LAYOUT =================== */}
      <div className="max-w-[1650px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT LARGE IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl h-[760px]"
        >
          <img
            src="/mnt/data/Screenshot 2025-11-21 134354.png"
            alt="Main Support"
            className="w-full h-full object-cover transition-transform duration-[900ms] hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 opacity-80" />

          {/* Glass Label */}
          <div className="
            absolute bottom-6 left-6 
            bg-white/25 backdrop-blur-xl 
            px-6 py-3 rounded-2xl
            border border-white/40
            text-white shadow-lg
          ">
            <p className="text-lg font-semibold tracking-wide">
              Premium Orthopedic Support
            </p>
          </div>
        </motion.div>

        {/* RIGHT COLLAGE GRID */}
        <div className="grid grid-cols-2 gap-6 h-[760px]">

          {[1, 2, 3, 4].map((num, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative overflow-hidden rounded-2xl shadow-xl group"
            >
              <img
                src="/mnt/data/Screenshot 2025-11-21 134354.png"
                alt={`support-${num}`}
                className="
                  w-full h-full object-cover 
                  transition-transform duration-700
                  group-hover:scale-110
                "
              />

              {/* Hover Overlay */}
              <div className="
                absolute inset-0 
                bg-gradient-to-br from-[#2F86D6]/20 via-[#63B46B]/20 to-transparent
                opacity-0 group-hover:opacity-100
                transition duration-500
              " />

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
