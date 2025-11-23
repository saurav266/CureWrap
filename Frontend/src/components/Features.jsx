import React from 'react';
import { FaUndoAlt } from 'react-icons/fa';
import { TbTruckDelivery } from "react-icons/tb";
import { motion } from 'framer-motion';
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";

const Features = () => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.20,
        delayChildren: 0.25,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const items = [
    {
      icon: FaUndoAlt,
      title: "Free Returns",
      description: "Returns within 7 days"
    },
    {
      icon: RiSecurePaymentFill,
      title: "Secured Payments",
      description: "SSL encrypted & trusted payments"
    },
    {
      icon: MdVerified,
      title: "Verified Sellers",
      description: "Quality-checked & trusted sellers"
    },
    {
      icon: TbTruckDelivery,
      title: "Free Delivery",
      description: "Free delivery on all orders"
    }
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-14"
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              variants={fadeUp}
              className="group flex flex-col items-center text-center select-none"
            >
              {/* Animated Icon */}
              <motion.div
                whileHover={{
                  scale: 1.35,
                  y: -6,
                  rotate: 2,
                  transition: { type: "spring", stiffness: 180 }
                }}
                className="mb-4"
              >
                <Icon
                  size={48}   // 👈 Ensures all icons are EXACT same size
                  className="
                    text-black 
                    transition-all duration-300 
                    group-hover:text-blue-600 
                    group-hover:drop-shadow-[0_6px_18px_rgba(59,130,246,0.45)]
                  "
                />
              </motion.div>

              {/* Animated Title */}
              <motion.h4
                whileHover={{
                  y: -3,
                  letterSpacing: "1.5px",
                  transition: { duration: 0.3 }
                }}
                className="
                  font-bold 
                  text-base 
                  md:text-lg 
                  transition-all duration-300 
                  group-hover:text-blue-600
                "
              >
                {item.title}
              </motion.h4>

              {/* Subtext */}
              <motion.p
                whileHover={{ y: -2, opacity: 1 }}
                className="
                  text-sm 
                  mt-1 
                  text-gray-600 
                  leading-relaxed 
                  transition-all duration-300
                "
              >
                {item.description}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Features;
