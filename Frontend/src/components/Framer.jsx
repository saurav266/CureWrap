// src/components/UltimateSupportSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import problemKnee from "../assets/frontend_assets/curewrap/kneeProblem.png";
import problemBack from "../assets/frontend_assets/curewrap/backProblem.png";
import problemPosture from "../assets/frontend_assets/curewrap/posture_problem.png";
import problemLigament from "../assets/frontend_assets/curewrap/backPain.png";
import problemRehab from "../assets/frontend_assets/curewrap/rehabilitation_phase.png";
import fallbackMain from "../assets/frontend_assets/curewrap/backPain.png";

const backendUrl = "http://localhost:8000";

const problemImages = [
  problemKnee,
  problemRehab,
  problemBack,
  problemLigament,
  problemPosture,
];

const problemTitles = [
  "Knee Pain / Ligament Injury",
  "Rehabilitation & Recovery",
  "Lower Back Pain",
  "Posture / Spine Imbalance",
  "Lumbar / Slip Disc",
];

export default function UltimateSupportSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showProblem, setShowProblem] = useState(true);

  // Fetch 5 products
  useEffect(() => {
    fetch(`${backendUrl}/api/users/products?limit=5`)
      .then((res) => res.json())
      .then((data) => setProducts((data.products || []).slice(0, 5)))
      .catch(() => setProducts([]));
  }, []);

  // Autoplay toggle every 4s
  useEffect(() => {
    const interval = setInterval(() => setShowProblem((p) => !p), 4000);
    return () => clearInterval(interval);
  }, []);

  const getProductImage = (p) => {
    const img = p?.images?.[0];
    if (!img?.url) return fallbackMain;
    return img.url.startsWith("http")
      ? img.url
      : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
  };

  const mainProduct = products[0];
  const smallProducts = products.slice(1);

  return (
    <section className="bg-white py-20 px-4 md:px-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Ultimate Support You Need
        </motion.h2>
        <motion.p className="text-lg md:text-xl text-gray-600 mt-4">
          Medical-grade orthopedic wear designed for comfort and pain relief.
        </motion.p>
        <motion.p className="text-lg text-gray-600 mt-3">
          From pain to performance — CureWrap strengthens your movement.
        </motion.p>
        <div className="w-24 h-1 bg-green-500 mx-auto mt-6 rounded-full" />
      </div>

      {/* GRID */}
      <div className="max-w-[1650px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LARGE LEFT */}
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl h-[760px] cursor-pointer"
          onClick={() => mainProduct && navigate(`/product/${mainProduct._id}`)}
        >
          <motion.img
            key={showProblem ? "main-problem" : "main-solution"}
            src={
              showProblem
                ? problemImages[0]
                : getProductImage(mainProduct)
            }
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
          <div className="absolute bottom-6 left-6 bg-white/25 backdrop-blur-xl px-6 py-3 rounded-2xl text-white border border-white/40 shadow-lg">
            <p className="text-lg font-semibold">
              {showProblem ? problemTitles[0] : mainProduct?.name}
            </p>
            <p className="text-xs text-white/80 mt-1">
              Auto transform: Problem → Solution
            </p>
          </div>
        </motion.div>

        {/* SMALL 4 */}
        <div className="grid grid-cols-2 gap-6 h-[760px]">
          {[0, 1, 2, 3].map((i) => {
            const product = smallProducts[i];
            return (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer"
                onClick={() => product && navigate(`/product/${product._id}`)}
              >
                <motion.img
                  key={showProblem ? `small-problem-${i}` : `small-solution-${i}`}
                  src={
                    showProblem
                      ? problemImages[i + 1]
                      : getProductImage(product)
                  }
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2F86D6]/20 via-[#63B46B]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2">
                  <p className="text-xs text-green-300 uppercase tracking-wide">
                    {showProblem ? "Problem" : "Solution"}
                  </p>
                  <p className="text-sm text-white font-semibold truncate">
                    {showProblem ? problemTitles[i + 1] : product?.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
