// CureWrapAboutV2.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Award, Heart, Target, CheckCircle } from "lucide-react";
import { assets } from "../assets/admin_assets/assets.js";

import heroimg from "../assets/Frontend_assets/about/women.jpg";
import athlete from "../assets/Frontend_assets/curewrap/athlete.png";
import hingeknee from "../assets/Frontend_assets/curewrap/hingeKnee.png";
import postureBelt from "../assets/Frontend_assets/curewrap/postureBelt.png";
import lsLumber from "../assets/Frontend_assets/curewrap/lsLumber.png";
import childLady from "../assets/Frontend_assets/curewrap/childLady.png";
import playing from "../assets/Frontend_assets/curewrap/playing.png";
import dumbell from "../assets/Frontend_assets/about/dumbell.png";

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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="absolute left-8 top-12 md:left-16 md:top-20 flex flex-col gap-6 z-30">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Award className="w-6 h-6 text-teal-600" />
            <div>
              <div className="text-sm text-gray-600">Trusted</div>
              <div className="font-semibold text-gray-900">10k+ Reviews</div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <div className="text-sm text-gray-600">Loved by</div>
              <div className="font-semibold text-gray-900">10k Customers</div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-6 backdrop-blur-sm bg-white/10 px-6 py-4 rounded-3xl">
            <motion.span initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }} className="inline-block text-white font-light tracking-[0.15em] text-xl md:text-2xl">ABOUT</motion.span>
            <div className="text-3xl md:text-4xl font-semibold tracking-tight relative">
              <motion.span initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ color: brandBlue }}>Cure</motion.span>
              <motion.span initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ color: brandGreen }} className="ml-1">Wrap</motion.span>
            </div>
          </motion.div>
        </div>

        <div className="absolute left-0 right-0 bottom-0">
          <svg viewBox="0 0 1440 120" className="w-full h-[120px] block" preserveAspectRatio="none">
            <path d="M0,40 C200,120 400,0 720,24 C1040,48 1240,120 1440,80 L1440 120 L0 120 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 className="font-heading text-4xl md:text-6xl text-gray-900 mb-3" initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}>Who We Are</motion.h2>
            <p className="font-text text-gray-700 text-[1.35rem] leading-relaxed">
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
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">5-Star Reviews</div>
              </div>
              <div>
                <Heart className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR BEGINNINGS */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-6 bg-gray-50">
        <motion.h2 className="font-heading text-3xl md:text-6xl text-gray-900 mb-2">Our Beginnings</motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <p className="font-text text-gray-700 text-[1.35rem] leading-relaxed">
            CureWrap began with a simple realization — supportive gear often hurt more than it helped.
            Braces slipped, straps dug into skin, and bulky designs made movement uncomfortable.
            <br /><br />
            We set out to build something better: support that stays in place, adapts to your body,
            and feels comfortable from the first minute to the last step of the day.
            Months of prototyping and real-world testing led to our first breakthrough —
            compression that stabilizes without limiting motion.
          </p>
          <motion.img src={childLady} className="rounded-2xl shadow-lg w-full h-119 object-cover" />
        </div>
      </section>

      {/* UNIQUENESS */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-heading text-3xl md:text-6xl text-gray-900 mb-3">Our Uniqueness</h3>
            <p className="font-text text-gray-700 text-[1.35rem] leading-relaxed mb-6">
              Unlike generic braces, every CureWrap product is engineered around biomechanics —
              targeting the specific joints and muscle groups that need stability the most.
              <br /><br />
              Our designs feature breathable materials, no-slip interiors,
              and pressure distribution zones that support without creating soreness.
            </p>

            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/90 p-4 shadow w-[180px]">
                <CheckCircle className="w-6 h-6 text-teal-600 mb-2" />
                <div className="font-semibold">Anti-Slip Support Bands</div>
                <p className="font-text text-sm text-gray-600">Stays in place from first rep to last.</p>
              </div>
              <div className="bg-white/90 p-4 shadow w-[180px]">
                <Target className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="font-semibold">Precision Compression Zones</div>
                <p className="font-text text-sm text-gray-600">Stability exactly where it’s needed.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full overflow-hidden">
            <img src={athlete} className="col-span-2 h-75 w-full object-cover shadow-md" />
            <img src={dumbell} className="h-80 w-full object-cover shadow-md" />
            <img src={lsLumber} className="col-span-2 h-85 w-full object-cover shadow-md" />
          </div>
        </div>
      </section>

      {/* WHY WE DO IT */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4 w-full overflow-hidden">
              <img src={postureBelt} className="w-full h-[500px] object-cover rounded-2xl shadow-md" />
              <img src={hingeknee} className="w-full h-[500px] object-cover rounded-2xl shadow-md" />
            </div>

            <div>
              <h3 className="font-heading text-3xl md:text-6xl text-gray-900 mb-3">Why We Do What We Do</h3>
              <p className="font-text text-gray-700 text-[1.35rem] leading-relaxed">
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
            <h3 className="font-heading text-3xl md:text-6xl text-gray-900 mb-3">Our Mission</h3>
            <p className="font-text text-gray-700 text-[1.35rem] leading-relaxed">
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
          <motion.img src={playing} className="shadow-lg w-full h-100 object-cover" />
        </div>
      </section>

      {/* QUALITY CHECK */}
      <section className="bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-heading text-3xl md:text-6xl mb-3">Preparation & Initial Quality Check</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <p className="font-text text-white text-[1.35rem] leading-relaxed">
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
        <h3 className="font-heading text-3xl md:text-6xl text-gray-900 mb-3">Join the CureWrap Family</h3>
        <p className="font-text text-gray-700 text-[1.35rem] mb-8 max-w-2xl mx-auto">
          Whether healing from an injury or managing daily discomfort,
          you deserve support that never gets in the way of living your life.
          Experience the difference of wraps and braces engineered for freedom, not restriction.
        </p>
        <Link to="/product" className="bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-[1.03] transition transform">
          Shop Now
        </Link>
        <p className="mt-6 text-gray-500 font-medium tracking-wide font-text">
          Move Better. Live Better. — The CureWrap Way
        </p>
      </section>
    </div>
  );
}