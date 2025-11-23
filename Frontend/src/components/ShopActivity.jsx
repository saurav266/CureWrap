import { motion } from "framer-motion";

// Brand gradient (use your CureWrap identity)
const brandGradient =
  "bg-gradient-to-r from-[#2F86D6]/80 to-[#63B46B]/80";

const activities = [
  { 
    name: "Gym / Workout", 
    img: "/mnt/data/Screenshot 2025-11-21 134354.png",
    link: "https://share.google/images/J5AtnOEF53f0AkotV" 
  },
  { 
    name: "Running / Jogging", 
    img: "/mnt/data/Screenshot 2025-11-21 134354.png", 
    link: "https://share.google/images/EAK8nMNEaXgHZOLdH" 
  },
  { 
    name: "Yoga / Pilates", 
    img: "/mnt/data/Screenshot 2025-11-21 134354.png", 
    link: "https://share.google/images/Zq1fq6JtwNkzzycN2" 
  },
  { 
    name: "Rehabilitation", 
    img: "/mnt/data/Screenshot 2025-11-21 134354.png", 
    link: "https://share.google/images/ZBIyOkyEM5E92kePR" 
  },
];

export default function ShopByActivitySection() {
  return (
    <section className="py-20 px-4 md:px-12 lg:px-20 bg-white">

      {/* TEXT HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Shop by Activity
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gray-600 text-lg md:text-xl mt-4"
        >
          Choose the right supportive gear that empowers your lifestyle.
        </motion.p>

        {/* Decorative green line */}
        <div className="mx-auto mt-6 w-24 h-1 rounded-full bg-green-500"></div>
      </div>

      {/* GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {activities.map((activity, idx) => (
          <motion.a
            key={idx}
            href={activity.link}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            className="group relative block overflow-hidden rounded-2xl shadow-xl"
          >

            {/* IMAGE */}
            <motion.img
              src={activity.img}
              alt={activity.name}
              className="
                w-full h-[380px] object-cover 
                transition-all duration-700 
                group-hover:scale-110"
            />

            {/* GRADIENT BRAND OVERLAY */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-80 transition-all duration-500 ${brandGradient}`}
            />

            {/* GLASS INNER CARD */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="
                absolute bottom-4 left-1/2 -translate-x-1/2
                w-[85%] 
                bg-white/15 backdrop-blur-xl 
                px-6 py-4 rounded-xl
                shadow-[0_4px_30px_rgba(0,0,0,0.18)]
                border border-white/30
                text-white
                opacity-0 group-hover:opacity-100
                translate-y-3 group-hover:translate-y-0
                transition-all duration-500
              "
            >
              <div className="text-xl font-bold tracking-wide drop-shadow-md">
                {activity.name}
              </div>
            </motion.div> */}

            {/* DIAGONAL LABEL STRIP (premium style) */}
            <div
              className="
                absolute bottom-0 left-0 w-full 
                bg-green-600 text-white 
                py-2 px-4 text-lg font-semibold
                transform -skew-y-3 
                opacity-100 group-hover:opacity-0
                transition-all duration-500
              "
            >
              {activity.name}
            </div>

          </motion.a>
        ))}
      </div>
    </section>
  );
}
