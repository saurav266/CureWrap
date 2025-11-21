import { motion } from "framer-motion";
import daily from "../assets/daily-use_1.webp";
import sport from "../assets/sports_1.webp";
import work from "../assets/work.webp";
import wrist from "../assets/wrist.jpg";

const activities = [
  { 
    name: "Gym / Workout", 
    img: sport, 
    link: "/shop/activity/gym" 
  },
  { 
    name: "Running / Jogging", 
    img: wrist, 
    link: "/shop/activity/running" 
  },
  { 
    name: "Yoga / Pilates", 
    img: daily, 
    link: "/shop/activity/yoga" 
  },
  { 
    name: "Rehabilitation", 
    img: work, 
    link: "/shop/activity/rehab" 
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
          Discover Orthopedic Solutions Tailored to Your Lifestyle
        </p>
      </div>

      {/* IMAGE GRID — WIDER & TIGHTER */}
      <div className="max-w-[1900px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map((activity, idx) => (
          <motion.a
            key={idx}
            href={activity.link}
            className="relative block overflow-hidden shadow-xl group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            {/* IMAGE */}
            <img
              src={activity.img}
              alt={activity.name}
              className="w-full h-80 md:h-[360px] lg:h-[400px] xl:h-[420px] 
                         object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-green bg-opacity-30 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

            {/* LABEL */}
            <div 
              className="
                absolute bottom-0 left-0 
                w-3/4
                text-white text-lg md:text-xl 
                bg-green-400 font-semibold 
                py-3 px-4
                drop-shadow-lg
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
