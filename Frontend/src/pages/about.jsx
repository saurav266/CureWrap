import React, { useEffect, useState } from "react";
import { Award, Heart, Target, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import vision from "../assets/Frontend_assets/about/visiom.jpg";
import begining from "../assets/Frontend_assets/about/begining.jpg";
import dumbell from "../assets/Frontend_assets/about/dumbell.png";
import uniq from "../assets/Frontend_assets/about/uniq.jpg";
import whatdo from "../assets/Frontend_assets/about/what-do.png";
import whatdo2 from "../assets/Frontend_assets/about/what-we2.png";
import ourMission from "../assets/Frontend_assets/about/ourMission.png";
import quality from "../assets/Frontend_assets/about/quality.png";
import quality2 from "../assets/Frontend_assets/about/quality2.png";
import Hero from "../assets/Frontend_assets/about/hero.png";
import kneeOld from "../assets/Frontend_assets/about/kneeOld.jpg";
import Hero2 from "../assets/Frontend_assets/about/Hero2-Photoroom.png";

export default function CureWrapAbout() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white ">
      {/* Hero Section */}
      <section className="w-full bg-linear-to-t from-white to-[#C3D8E6] pt-12 pb-24 md:pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-blue-100 to-white pointer-events-none" />

        {/* Layout Grid */}
        <div className="relative max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-[0.55fr_0.45fr] items-center gap-8">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10 pt-8" // Added 'pt-8' to push the text down a little
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gray-800">WHO ARE </span>
              <span className="text-teal-600">WE</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              At <span className="font-semibold text-teal-600">CureWrap</span>,
              we are not just a business but a family bound by a shared purpose.
              Nestled in the heart of Los Angeles, California, our family-run
              operation seeks to extend the joy of pain-free living, amplified
              productivity, and the simple pleasure of everyday life to you and
              yours. My name is Dave, the founder of CureWrap, and I am
              delighted to share our journey with you.
            </p>

            {/* cards (Moved here to be under the text on small screens, and occupy the card space on desktop) */}
            <div className="relative mt-12 md:mt-20">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-linear-to-br from-[#2BA468] to-[#57AF82] rounded-xl p-3 text-white shadow-xl">
                  <Award className="w-8 h-8 mb-2" />
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <div className="text-sm">5-STAR REVIEWS</div>
                </div>
                <div className="bg-linear-to-br from-[#077BD1] to-[#3D98DA] rounded-xl p-3 text-white shadow-xl mt-8">
                  <Heart className="w-8 h-8 mb-2" />
                  <div className="text-4xl font-bold mb-2">1 Lakh+</div>
                  <div className="text-sm">Indian CUSTOMERS</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-teal-600 font-semibold text-xl">
                  7 YEARS OF MAKING LIVES EASIER
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE IMAGE + HOTSPOTS */}
          <motion.div
            initial={{ opacity: 0, x: 130 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative flex justify-end pr-0 md:pr-2 lg:pr-4 pt-10" // Added 'pt-10' to push the image down
          >
            <motion.img
              src={Hero2}
              alt="Hero Image"
              className="
                w-full max-w-[1350px]
                h-auto object-contain
                drop-shadow-2xl brightness-110 contrast-110
                scale-[1.28] md:scale-[1.4] lg:scale-[1.6] 
                hover:scale-[1.35] md:hover:scale-[1.45] lg:hover:scale-[1.65] 
                transition-transform duration-500 ease-out
              " // Increased scale for bigger size and added hover scale up
            />
          </motion.div>

          {/* cards (Original card section removed as it was moved into the left div for better layout control) */}
        </div>
      </section>

      {/* Our Beginnings Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-teal-600 text-center mb-12">
            OUR BEGINNINGS
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                My personal struggle with persistent knee pain and the quest for
                a solution marked the genesis of CureWrap. Despite trying
                various solutions to ease the discomfort and reclaim my life, I
                was unable to find a knee brace that was both effective and
                comfortable. Frustrated but determined, I embarked on a journey
                of innovation, teaming up with leading orthopedic experts. After
                months of diligent research and development, the inaugural
                CureWrap knee brace was born.
              </p>
            </div>
            <div className="relative h-96">
              {/* Main large image */}
              <img
                src={kneeOld}
                alt="Active lifestyle"
                className="rounded-2xl shadow-2xl w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
              />

              {/* Small overlay images - collage style */}
              <div className="absolute top-4 right-4 w-36 h-28 overflow-hidden rounded-xl border-2 border-white shadow-xl">
                <img
                  src={dumbell}
                  alt="Woman exercising"
                  className="w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>

              <div className="absolute top-34 right-4 w-36 h-28 overflow-hidden rounded-xl border-2 border-white shadow-xl">
                <img
                  src={whatdo}
                  alt="Running woman"
                  className="w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>

              <div className="absolute bottom-4 right-4 w-36 h-28 overflow-hidden rounded-xl border-2 border-white shadow-xl">
                <img
                  src={whatdo2}
                  alt="Man training"
                  className="w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Our Uniqueness Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-teal-600 mb-12">
          OUR UNIQUENESS
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Every CureWrap product, at its core, is designed to deliver pain
              relief, unparalleled comfort, and convenience. We take immense
              pride in our comprehensive design process. Months of painstaking
              design, development, and testing go into each of our products. Our
              commitment to superior quality extends to our material selection,
              as we only use premium materials to ensure that you feel
              comfortable and confident in every step you take, whether it be
              walking your dog, playing with your children, or powering through
              an intense workout.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 items-stretch">
            <div className="overflow-hidden rounded-lg">
              <img
                src={dumbell}
                alt="Woman exercising"
                className="rounded-lg shadow-lg w-full max-w-full h-56 md:h-64 lg:h-72 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src={uniq}
                alt="Man exercising"
                className="rounded-lg shadow-lg w-full max-w-full h-56 md:h-64 lg:h-72 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Why We Do What We Do Section */}
      <section className="bg-linear-to-r from-teal-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4 items-stretch">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={whatdo}
                  alt="Running woman"
                  className="rounded-lg shadow-lg w-full max-w-full h-48 md:h-56 lg:h-64 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={whatdo2}
                  alt="Man training"
                  className="rounded-lg shadow-lg w-full max-w-full h-48 md:h-56 lg:h-64 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-teal-600 mb-6">
                WHY WE DO WHAT WE DO
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                My personal struggle with persistent knee pain and the quest for
                a solution marked the genesis of CureWrap. Despite trying
                various solutions to ease the discomfort and reclaim my life, I
                was unable to find a knee brace that was both effective and
                comfortable. Frustrated but determined, I embarked on a journey
                of innovation, teaming up with leading orthopedic experts. After
                months of diligent research and development, the inaugural
                CureWrap knee brace was born.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-teal-600 mb-6">
              OUR MISSION
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission at CureWrap is to create innovative, high-quality
              health solutions that help our customers achieve their peak
              performance. We are fueled by a passion for providing solutions
              that not only relieve pain but also allow you to push your limits
              and realize your full potential.
            </p>
          </div>
          <div>
            <img
              src={ourMission}
              alt="Happy couple"
              className="rounded-2xl shadow-2xl w-full h-64 md:h-80 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
            />
          </div>
        </div>
      </section>
      {/* Our Vision Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={vision}
                alt="Family time"
                className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
              />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-teal-600 mb-6">
                OUR VISION
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our vision is to become a globally recognized and beloved brand,
                synonymous with pain relief, support, comfort, and safety. We
                strive towards a future where the mention of enhancing one's
                fitness routine or comfort immediately brings to mind the name
                "CureWrap".
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Quality Check Section */}
      <section className="bg-linear-to-r from-teal-600 to-cyan-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-12">
            Preparation & Initial Quality Check
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white text-lg leading-relaxed">
                Our vision is to become a globally recognized and beloved brand,
                synonymous with pain relief, support, comfort and safety. We
                strive towards a future where the mention of enhancing one's
                fitness routine or comfort immediately brings to mind the name
                "CureWrap".
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 items-stretch">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={quality}
                  alt="Quality measurement"
                  className="rounded-lg shadow-xl w-full max-w-full h-48 md:h-56 lg:h-64 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={quality2}
                  alt="Product testing"
                  className="rounded-lg shadow-xl w-full max-w-full h-48 md:h-56 lg:h-64 object-cover hover:scale-110 cursor-pointer transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h3 className="text-4xl font-bold text-teal-600 mb-6">
          Join the CureWrap Family
        </h3>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Experience the difference that quality, comfort, and innovation can
          make in your daily life.
        </p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Shop Now
        </button>
      </section>
    </div>
  );
}
