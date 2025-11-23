import { motion } from "framer-motion";

const activities = [
  { 
    name: "Gym / Workout", 
    img: "/mnt/data/Screenshot 2025-11-21 134354.png", 
    link: "/https://share.google/images/J5AtnOEF53f0AkotV" 
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
    <section className="py-16 px-2 sm:px-6 lg:px-12 xl:px-16 bg-white">
      
      {/* TEXT HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Shop by Activity
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Choose the right supportive gear based on your daily routine and activity level.
        </p>
      </div>

      {/* IMAGE GRID — EXTRA WIDE */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {activities.map((activity, idx) => (
          <motion.a
            key={idx}
            href={activity.link}
            className="relative block overflow-hidden  shadow-xl group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            {/* IMAGE */}
            <img
              src={activity.img}
              alt={activity.name}
              className="w-full h-80 md:h-[360px] lg:h-[380px] xl:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-green bg-opacity-30 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

            {/* LABEL (UPDATED) */}
            <div 
              className="
                absolute bottom-0 left-0 
                w-3/4 h-0.5/4
                text-white text-lg md:text-xl 
                bg-green-500 font-semibold 
                py-3 px-4
                drop-shadow-lgcd 
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
