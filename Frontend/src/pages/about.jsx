// CureWrapAboutV2.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Award, Heart, Target, CheckCircle } from "lucide-react";
import { assets } from "../assets/admin_assets/assets.js";

// images (keep your existing imports)
import heroimg from "../assets/Frontend_assets/about/women.jpg";
import begining from "../assets/Frontend_assets/about/beginnings.png";
import dumbell from "../assets/Frontend_assets/about/dumbell.png";
import uniq from "../assets/Frontend_assets/about/belt.png";
import product from "../assets/Frontend_assets/about/product.png";
import whatdo2 from "../assets/Frontend_assets/about/oldWomen.png";
import ourMission from "../assets/Frontend_assets/about/ourMission.png";
import girl_yoga from "../assets/Frontend_assets/about/girl_yoga.png";
import father_son from "../assets/Frontend_assets/about/father_with_child.png";
import process1 from "../assets/Frontend_assets/about/process1.png";
import process2 from "../assets/Frontend_assets/about/process2.png";
import process3 from "../assets/Frontend_assets/about/process3.png";
const logoUrl = assets.logo;

export default function CureWrapAboutV2() {
  const { scrollYProgress } = useViewportScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const brandBlue = "#2F86D6";
  const brandGreen = "#63B46B";

  return (
    <div className="bg-white text-gray-800 antialiased">

      {/* HERO */}
      <section className="relative w-full h-[68vh] md:h-[80vh] lg:h-[88vh] overflow-hidden">
        <motion.img src={heroimg} style={{ y }} initial={{ scale: 1.02, opacity: 0.98 }} animate={{ scale: 1.0, opacity: 1 }} transition={{ duration: 1.1 }} className="absolute inset-0 w-full h-full object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/4 to-transparent pointer-events-none" />

        {/* floating cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="absolute left-8 top-12 md:left-16 md:top-20 flex flex-col gap-6 z-30">
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

        {/* headline */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-6 backdrop-blur-sm bg-white/10 px-6 py-4 rounded-3xl">
            <motion.span initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }} className="inline-block text-white font-light tracking-[0.15em] text-xl md:text-2xl">ABOUT</motion.span>
            <div className="text-3xl md:text-4xl font-semibold tracking-tight relative">
              <motion.span initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ color: brandBlue }}>Cure</motion.span>
              <motion.span initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ color: brandGreen }} className="ml-1">Wrap</motion.span>
            </div>
          </motion.div>
        </div>

        {/* wave */}
        <div className="absolute left-0 right-0 bottom-0"> <svg viewBox="0 0 1440 120" className="w-full h-[120px] block" preserveAspectRatio="none" > <path d="M0,40 C200,120 400,0 720,24 C1040,48 1240,120 1440,80 L1440 120 L0 120 Z" fill="#ffffff" /> </svg> </div>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}>Who We Are</motion.h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              At <span className="font-semibold" style={{ color: brandGreen }}>CureWrap</span>, we create orthotic supports that help people move with confidence.
              Every brace, wrap and belt we design blends medical-grade support with a natural, barely-there feel —
              built for long hours at work, workouts, and everyday comfort.
              <br /><br />
              Whether it’s a recovering athlete, a busy professional, or someone managing chronic pain,
              our mission is always the same — support movement without restricting it.
            </p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 shadow-lg">
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

      {/* divider */}
      <div className="w-full">
        <svg viewBox="0 0 1440 80" className="w-full h-[80px]"><path d="M0,24 C300,120 600,0 720,24 C840,48 1140,0 1440,24 L1440 80 L0 80 Z" fill="#f8fafc" /></svg>
      </div>

      {/* OUR BEGINNINGS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Beginnings</motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            CureWrap began with a simple realization — supportive gear often hurt more than it helped.
            Braces slipped, straps dug into skin, and bulky designs made movement uncomfortable.
            <br /><br />
            We set out to build something better: support that stays in place, adapts to your body,
            and feels comfortable from the first minute to the last step of the day.
            Months of prototyping and real-world testing led to our first breakthrough —
            compression that stabilizes without limiting motion.
          </p>
          <motion.img src={begining} className="rounded-2xl shadow-lg w-full h-120 object-cover" />
        </div>
      </section>

      {/* UNIQUENESS — FIXED PREMIUM COLLAGE */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Uniqueness</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Unlike generic braces, every CureWrap product is engineered around biomechanics —
              targeting the specific joints and muscle groups that need stability the most.
              <br /><br />
              Our designs feature breathable materials, no-slip interiors,
              and pressure distribution zones that support without creating soreness.
              The result? A secure fit that feels natural, even during hours of wear.
            </p>

            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/90 p-4 shadow w-[180px]">
                <CheckCircle className="w-6 h-6 text-teal-600 mb-2" />
                <div className="font-semibold">Anti-Slip Support Bands</div>
                <p className="text-sm text-gray-600">Stays in place from first rep to last.</p>
              </div>
              <div className="bg-white/90 p-4 shadow w-[180px]">
                <Target className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="font-semibold">Precision Compression Zones</div>
                <p className="text-sm text-gray-600">Stability exactly where it’s needed.</p>
              </div>
            </div>
          </div>

          {/* FIXED COLLAGE */}
          <div className="grid grid-cols-3 gap-4 w-full overflow-hidden">
            <img src={dumbell} className="col-span-2 h-80 w-full object-cover  shadow-md" />
            <img src={uniq} className="h-80 w-full object-cover  shadow-md" />
            <img src={product} className="col-span-2 h-74 w-full object-cover  shadow-md" />
          </div>
        </div>
      </section>

      {/* WHY WE DO IT — SPLIT COLLAGE */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-3 gap-4 w-full overflow-hidden">
              <img src={girl_yoga} className="col-span-1 h-[500px] w-full object-cover rounded-2xl shadow-md" />
              <div className="col-span-2 flex flex-col gap-4">
                <img src={whatdo2} className="h-[240px] w-full object-cover rounded-2xl shadow-md" />
                <img src={father_son} className="h-[240px] w-full object-cover rounded-2xl shadow-md" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why We Do What We Do</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Pain shouldn’t pause life — and movement shouldn’t require medication.
                We build products for people who want to stay active without discomfort,
                whether that means working at a desk, lifting weights, or playing with their kids.
                <br /><br />
                Nothing motivates us more than hearing users say,
                <span className="italic"> “I can walk again without thinking about my knee,” </span>
                or
                <span className="italic"> “I finished the day without back pain.”</span>
                <br /><br />
                Every story fuels our purpose: to make comfort and mobility accessible,
                reliable, and part of everyday life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to reinvent orthotic support — to make it smarter, more breathable,
              and easier to wear for anyone, at any age.
              <br /><br />
              We focus on real usability: clear sizing that actually fits,
              intuitive strap systems, flexible compression levels,
              and materials that feel soft even during long wear.
              <br /><br />
              CureWrap isn’t just about pain relief. It’s about giving people the freedom
              to live, move and perform without hesitation.
            </p>
          </div>
          <motion.img src={ourMission} className="shadow-lg w-full h-100 object-cover" />
        </div>
      </section>

      {/* QUALITY CHECK — HORIZONTAL COLLAGE */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Preparation & Initial Quality Check</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <p className="text-lg leading-relaxed">
              Every CureWrap product goes through rigorous inspection —
              from fabric durability and elasticity tests to stability under motion and sweat conditions.
              <br /><br />
              Pressure-distribution mapping ensures that compression supports rather than restricts.
              Stitching is reinforced for long-term use, and internal bands are tested against slippage under heat and motion.
              <br /><br />
              Only products that exceed our standards — not just meet them — receive the CureWrap tag.
            </p>

            <div className="grid grid-cols-3 gap-5 w-full overflow-hidden">
              <img src={process1} className="h-72 w-full object-cover rounded-2xl shadow-md" />
              <img src={process2} className="h-72 w-full object-cover rounded-2xl shadow-md" />
              <img src={process3} className="h-72 w-full object-cover rounded-2xl shadow-md" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join the CureWrap Family</h3>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Whether healing from an injury or managing daily discomfort,
          you deserve support that never gets in the way of living your life.
          Experience the difference of wraps and braces engineered for freedom, not restriction.
        </p>
        <Link to="/product" className="bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-[1.03] transition transform">
          Shop Now
        </Link>
        <p className="mt-6 text-gray-500 font-medium tracking-wide">
          Move Better. Live Better. — The CureWrap Way
        </p>
      </section>
    </div>
  );
}
