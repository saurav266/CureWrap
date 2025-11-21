import { motion } from "framer-motion";

export default function UltimateSupportSection() {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8 lg:px-10">
      
      {/* TEXT SECTION */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Ultimate Support You Need
        </h2>
        <p className="text-lg text-gray-600">
          We provide high-quality medical-grade orthopedic wear designed to offer
          the support, comfort, and pain relief you need. Our range includes knee,
          back, ankle braces and seat cushions—all crafted to enhance your
          lifestyle.
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Experience optimal relief, improved mobility, and better stability for
          daily activities or post-recovery support.
        </p>
      </div>

      {/* IMAGE LAYOUT — EXPANDED WIDTH + BALANCED GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* LEFT LARGE IMAGE (UNCHANGED) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full h-[740px] lg:h-[760px] overflow-hidden  shadow-lg"
        >
          <img
            src="/mnt/data/Screenshot 2025-11-21 134354.png"
            alt="Main Support"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* RIGHT SIDE — BALANCED 4 IMAGE GRID */}
        <div className="grid grid-cols-2 gap-4 h-[740px] lg:h-[760px]">
          {[1, 2, 3, 4].map((num, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="overflow-hidden  shadow-md w-full h-full"
            >
              <img
                src="/mnt/data/Screenshot 2025-11-21 134354.png"
                alt={`support-thumbnail-${num}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
