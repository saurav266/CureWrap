import React from "react";
import { FaUndoAlt } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { motion } from "framer-motion";

const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

export default function Features() {
  const items = [
    {
      icon: FaUndoAlt,
      title: "Free Returns",
      description: "Returns within 7 days",
    },
    {
      icon: RiSecurePaymentFill,
      title: "Secured Payments",
      description: "SSL encrypted & trusted payments",
    },
    {
      icon: MdVerified,
      title: "Verified Sellers",
      description: "Quality-checked & trusted sellers",
    },
    {
      icon: TbTruckDelivery,
      title: "Free Delivery",
      description: "Free delivery on all orders",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F86D6]/5 via-transparent to-[#63B46B]/5 pointer-events-none" />

      {/* Ripple circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#2F86D6]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#63B46B]/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: 0.2 }}
        className="
          max-w-7xl mx-auto
          grid
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-2 
          lg:grid-cols-4 
          gap-8 sm:gap-10 lg:gap-12
          px-6 md:px-12 lg:px-16
        "
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
              }}
              className="
                group 
                relative 
                bg-white 
                backdrop-blur-xl 
                p-8 
                rounded-2xl 
                shadow-lg 
                hover:shadow-2xl 
                transition-all 
                duration-400 
                border border-white/40
                flex flex-col items-center text-center
              "
            >
              {/* ICON */}
              <motion.div
                whileHover={{
                  scale: 1.25,
                  rotate: 4,
                  transition: { type: "spring", stiffness: 200 },
                }}
                className="
                  w-20 h-20 
                  flex items-center justify-center 
                  rounded-2xl 
                  mb-6
                  bg-gradient-to-br from-[#2F86D6] to-[#63B46B]
                  shadow-lg 
                  group-hover:shadow-2xl
                  transition
                "
              >
                <Icon className="text-white" size={32} />
              </motion.div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2F86D6] transition">
                {item.title}
              </h4>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>

              <div
                className="
                  absolute bottom-4 left-1/2 -translate-x-1/2 
                  w-0 h-[3px] 
                  bg-gradient-to-r from-[#2F86D6] to-[#63B46B] 
                  rounded-full 
                  group-hover:w-1/2 
                  transition-all duration-500
                "
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
