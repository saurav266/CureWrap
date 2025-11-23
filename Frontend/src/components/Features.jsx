import React from 'react';
import { FaShoppingBag, FaHeadset, FaTruck, FaUndoAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const items = [
    {
      icon: FaShoppingBag,
      title: "Free Returns",
      description: "Returns within 7 days"
    },
    {
      icon: FaHeadset,
      title: "Secured Payments",
      description: "SSL encryption & trusted payments"
    },
    {
      icon: FaTruck,
      title: "Verified Sellers",
      description: "verified and trusted sellers"
    },
    {
      icon: FaUndoAlt,
      title: "Free Delivery",
      description: "free delivery on all orders"
    }
  ];

  return (
    <section className="bg-white py-14 px-6 md:px-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12"
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
                  scale: 1.25,
                  y: -4,
                  transition: { type: "spring", stiffness: 200 }
                }}
                className="mb-3"
              >
                <Icon className="text-4xl text-black transition-all duration-300 group-hover:text-blue-600 group-hover:drop-shadow-[0_4px_10px_rgba(59,130,246,0.35)]" />
              </motion.div>

              {/* Animated Title */}
              <motion.h4
                whileHover={{ x: 3 }}
                className="font-semibold text-sm tracking-wide transition-all duration-300 group-hover:text-blue-600"
              >
                {item.title}
              </motion.h4>

              {/* Subtext */}
              <p className="text-xs mt-1 text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Features;
