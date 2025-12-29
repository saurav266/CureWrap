import React from "react";
import { FaUndoAlt } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { MdVerified, MdSwapHoriz } from "react-icons/md";
import { motion } from "framer-motion";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Brand colors
const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

export default function Features() {
  const items = [
    {
      icon: FaUndoAlt,
      title: "Free Returns",
      description: "Returns within 7 days for incorrect or damaged product",
    },
    {
      icon: RiSecurePaymentFill,
      title: "Secured Payments",
      description: "SSL encrypted & trusted payments",
    },
    {
      icon: MdVerified,
      title: "Quality Assured",
      description: "Quality-checked & trusted products",
    },
    {
      icon: TbTruckDelivery,
      title: "Free Standard Delivery",
      description: "Free standard delivery on all orders",
    },
    {
      icon: MdSwapHoriz,
      title: "Easy Size Exchange",
      description: "Because the right fit matters most",
    },
  ];

  const Card = ({ item }) => {
    const Icon = item.icon;
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className="
          group relative bg-white backdrop-blur-xl
          p-8 rounded-2xl shadow-lg hover:shadow-2xl
          transition-all duration-300 border border-white/40
          text-center
        "
      >
        {/* ICON */}
        <motion.div
          whileHover={{ scale: 1.25, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="
            w-20 h-20 mx-auto mb-6 flex items-center justify-center
            rounded-2xl bg-gradient-to-br from-[#2F86D6] to-[#63B46B]
            shadow-lg group-hover:shadow-2xl
          "
        >
          <Icon className="text-white" size={32} />
        </motion.div>

        {/* TITLE */}
        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2F86D6] transition">
          {item.title}
        </h4>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </p>

        {/* SHIMMER */}
        <div
          className="
            absolute bottom-4 left-1/2 -translate-x-1/2
            w-0 h-[3px] bg-gradient-to-r from-[#2F86D6] to-[#63B46B]
            rounded-full group-hover:w-1/2 transition-all duration-500
          "
        />
      </motion.div>
    );
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F86D6]/5 via-transparent to-[#63B46B]/5 pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#2F86D6]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#63B46B]/10 rounded-full blur-3xl" />

      {/* ✅ Desktop / Tablet Grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: 0.15 }}
        className="hidden sm:grid max-w-7xl mx-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6 md:px-16"
      >
        {items.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </motion.div>

      {/* 📱 Mobile Carousel */}
      <div className="sm:hidden px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <Card item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
