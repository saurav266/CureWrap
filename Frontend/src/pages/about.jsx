// CureWrapAboutV2.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Award, Heart, Target, CheckCircle } from "lucide-react";
import { assets } from "../assets/admin_assets/assets.js";
// images (keep your existing imports)
import vision from "../assets/Frontend_assets/about/visiom.jpg";
import begining from "../assets/Frontend_assets/about/begining.jpg";
import dumbell from "../assets/Frontend_assets/about/dumbell.png";
import uniq from "../assets/Frontend_assets/about/uniq.jpg";
import whatdo from "../assets/Frontend_assets/about/what-do.png";
import whatdo2 from "../assets/Frontend_assets/about/what-we2.png";
import ourMission from "../assets/Frontend_assets/about/ourMission.png";
import quality from "../assets/Frontend_assets/about/quality.png";
import quality2 from "../assets/Frontend_assets/about/quality2.png";
import heroimg from "../assets/Frontend_assets/about/women.jpg";

// use the local uploaded logo image path (developer-provided)
const logoUrl = assets.logo;

/* -----------------------
   AutoCollage (keeps previous behavior)
   - adapts to any number of images
------------------------ */
const AutoCollage = ({ images = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          viewport={{ once: true }}
          className={`overflow-hidden ${i === 0 ? "md:col-span-2" : ""}`}
        >
          <img
            src={img}
            alt={`collage-${i}`}
            className="w-full h-64 md:h-72 object-cover transform transition-all duration-500 hover:scale-105"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function CureWrapAboutV2() {
  // parallax: move image a small amount on scroll
  const { scrollYProgress } = useViewportScroll();
  // translateY small negative so image moves slower (parallax)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  // brand colors approximated from your uploaded logo:
  const brandBlue = "#2F86D6"; // Cure
  const brandGreen = "#63B46B"; // Wrap

  return (
    <div className="bg-white text-gray-800 antialiased">
      {/* ================= HERO (Parallax + Visible bottom) ================= */}
      <section className="relative w-full h-[68vh] md:h-[80vh] lg:h-[88vh] overflow-hidden">
        {/* parallax image */}
        <motion.img
          src={heroimg}
          style={{ y }}
          initial={{ scale: 1.02, opacity: 0.98 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-bottom" /* object-bottom keeps bottom visible */
        />

        {/* soft gradient overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/4 to-transparent pointer-events-none" />

        {/* floating badges (icons) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="absolute left-8 top-12 md:left-16 md:top-20 flex flex-col gap-6 z-30"
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Award className="w-6 h-6 text-teal-600" />
            <div>
              <div className="text-sm text-gray-600">Trusted</div>
              <div className="font-semibold text-gray-900">100k+ Reviews</div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <div className="text-sm text-gray-600">Loved by</div>
              <div className="font-semibold text-gray-900">12M Customers</div>
            </div>
          </div>
        </motion.div>

        {/* centered brand text with logo */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="flex items-center gap-6 backdrop-blur-sm bg-white/10 px-6 py-4 rounded-3xl"
            style={{ pointerEvents: "none" }}
          >
            {/* small logo */}
            {/* <img src={logoUrl} alt="CureWrap logo" className="h-10 w-auto object-contain" /> */}
            <motion.span
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="inline-block text-white font-light tracking-[0.15em] text-xl md:text-2xl"
            >
              ABOUT
            </motion.span>
            {/* animated CureWrap words (two colors + shimmer) */}
            <div className="text-3xl md:text-4xl font-semibold tracking-tight">
              <motion.span
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                style={{ color: brandBlue }}
                className="inline-block"
              >
                Cure
              </motion.span>

              <motion.span
                initial={{ x: 8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                style={{ color: brandGreen }}
                className="inline-block ml-1"
              >
                Wrap
              </motion.span>

              {/* subtle shimmer overlay */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2, duration: 1.1, repeat: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ mixBlendMode: "overlay" }}
              />
            </div>
          </motion.div>
        </div>

        {/* curved wave separator at bottom of hero */}
        <div className="absolute left-0 right-0 bottom-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[120px] block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C200,120 400,0 720,24 C1040,48 1240,120 1440,80 L1440 120 L0 120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ================= PAGE CONTENT ================= */}

      {/* WHO WE ARE */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-6">
        {" "}
        {/* negative top to tuck under the wave */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Who We Are
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-700 text-lg leading-relaxed"
            >
              At{" "}
              <span className="font-semibold" style={{ color: brandGreen }}>
                CureWrap
              </span>
              , we design clean, effective orthotic support that empowers
              everyday movement. We combine deep research with premium materials
              so comfort becomes the background of life—not the focus.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <Award className="w-10 h-10 mx-auto text-teal-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">100k+</div>
                <div className="text-sm text-gray-600">5-Star Reviews</div>
              </div>

              <div>
                <Heart className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">12M+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* soft wave (divider) */}
      <div className="w-full">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,24 C300,120 600,0 720,24 C840,48 1140,0 1440,24 L1440 80 L0 80 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      {/* BEGINNINGS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Beginnings
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              CureWrap started from a simple need: a comfortable, effective
              brace that actually helped people move better. That led to months
              of research, prototypes and real-world testing.
            </p>
          </motion.div>

          <motion.img
            src={begining}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
          />
        </div>
      </section>

      {/* UNIQUENESS / COLLAGE */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Uniqueness
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Every CureWrap product is engineered with human biomechanics in
              mind — durable materials, precise fit, and everyday comfort.
            </p>
            <div className="flex gap-3">
              <div className="bg-white/90 rounded-xl p-4 shadow">
                <CheckCircle className="w-6 h-6 text-teal-600 mb-2" />
                <div className="font-semibold">Quality Materials</div>
              </div>
              <div className="bg-white/90 rounded-xl p-4 shadow">
                <Target className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="font-semibold">Precision Fit</div>
              </div>
            </div>
          </div>

          <AutoCollage images={[dumbell, uniq, vision, whatdo]} />
        </div>
      </section>

      {/* WHY WE DO IT */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AutoCollage images={[whatdo, whatdo2, begining]} />
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why We Do What We Do
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                We design for the long run — to make motion pain-free for people
                who want a life in motion, not paused by aches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              To craft supportive products that help people stay active, built
              on research and real feedback.
            </p>
          </div>
          <motion.img
            src={ourMission}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
          />
        </div>
      </section>

      {/* QUALITY CHECK */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Preparation & Initial Quality Check
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <p className="text-lg leading-relaxed">
              We test everything — durability, fit, sweat-resistance, and
              function.
            </p>
            <AutoCollage images={[quality, quality2, whatdo]} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Join the CureWrap Family
        </h3>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Discover how premium support can change your day-to-day life.
        </p>
        <Link
          to="/product"
          className="bg-linear-to-r from-[#2F86D6] to-[#63B46B] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-[1.03] transition transform"
        >
          Shop Now
        </Link>
      </section>
    </div>
  );
}
