import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { AiOutlineHeart, AiFillHeart, AiOutlineEye, AiOutlineClose,AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";


import { assets } from '../../assets/frontend_assets/assets.js';

const products = [
  { id: 1, title: "Curewrap Compression Knee Sleeves", price: "$25.00", img: assets.product1, discount: "-18%", rating: 5, reviews: 6066, thumbs: [assets.product1, assets.product2, assets.product3] },
  { id: 2, title: "Curewrap Adjustable Knee Brace", price: "$35.00", img: assets.product2, discount: "-7%", rating: 3, reviews: 112, thumbs: [assets.product2, assets.product1, assets.product3] },
  { id: 3, title: "Curewrap Foot & Ankle Brace Support", price: "$40.00", img: assets.product3, discount: "-16%", rating: 4, reviews: 441, thumbs: [assets.product3, assets.product1, assets.product4] },
  { id: 4, title: "Curewrap Reinforced Back Brace", price: "$50.00", img: assets.product4, discount: "-25%", rating: 4, reviews: 892, thumbs: [assets.product4, assets.product2, assets.product1] },
];

export default function FeaturedProducts() {
  const [quickView, setQuickView] = useState(null);
  const [selectedThumb, setSelectedThumb] = useState("");
  const [animateHeart, setAnimateHeart] = useState(false);

  return (
    <>
      {/* SECTION */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <h2 className="text-center text-4xl font-bold text-gray-900">
            FEATURED PRODUCTS
          </h2>
          <p className="text-center text-lg text-gray-600 mt-3 mb-10">
            Explore Our Top-Rated Orthopedic Essentials
          </p>

          {/* CUSTOM ARROWS */}
          <div className="flex justify-end gap-4 mb-4">
            <button className="swiper-prev bg-gray-200 p-3 rounded-full hover:bg-green-600 hover:text-white transition">❮</button>
            <button className="swiper-next bg-gray-200 p-3 rounded-full hover:bg-green-600 hover:text-white transition">❯</button>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div className="relative bg-white shadow-md hover:shadow-xl transition p-3 pb-5 overflow-hidden">

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {p.discount}
                  </div>

                  {/* Floating ❤️ animation */}
                  {animateHeart && (
                    <AiFillHeart className="text-red-500 text-4xl absolute top-5 right-8 animate-floatUp opacity-0" />
                  )}

                  {/* IMAGE */}
                  <div className="relative w-full h-[330px] overflow-hidden group">

                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* ACTION BUTTONS (hover only) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">

                      {/* WISHLIST BUTTON + TOOLTIP */}
                      <div className="relative group/icon">
                        <button
                          onClick={() => {
                            setAnimateHeart(true);
                            setTimeout(() => setAnimateHeart(false), 800);
                          }}
                          className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                        >
                          <AiOutlineHeart size={24} className="text-gray-800" />
                        </button>

                        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white shadow px-2 py-1 rounded text-xs opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
                          Add to Wishlist
                        </span>
                      </div>

                      {/* QUICK VIEW ICON + TOOLTIP */}
                      <div className="relative group/icon">
                        <button
                          onClick={() => { setQuickView(p); setSelectedThumb(p.img); }}
                          className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                        >
                          <AiOutlineEye size={24} className="text-gray-800" />
                        </button>

                        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white shadow px-2 py-1 rounded text-xs opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
                          Quick View
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: p.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({p.reviews})</span>
                  </div>

                  {/* TITLE */}
                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                    {p.title}
                  </h3>

                  {/* PRICE */}
                  <p className="text-green-600 font-bold text-xl mt-2">
                    {p.price}
                  </p>

                  {/* SHOP NOW */}
                  <button className="mt-3 w-full py-2 rounded-full border border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition">
                    <AiOutlineShoppingCart size={24} className="inline mr-2" /> SHOP NOW
                  </button>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      {quickView && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-4xl relative">

            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-black"
            >
              <AiOutlineClose size={28} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedThumb}
                  className="w-full h-[420px] object-cover rounded-xl"
                />

                <div className="grid grid-cols-4 gap-3 mt-4">
                  {quickView.thumbs.map((t, i) => (
                    <img
                      key={i}
                      src={t}
                      onClick={() => setSelectedThumb(t)}
                      className={`w-full h-20 object-cover rounded-lg border cursor-pointer ${
                        selectedThumb === t ? "border-green-600" : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">{quickView.title}</h2>

                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: quickView.rating }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({quickView.reviews} reviews)
                  </span>
                </div>

                <p className="text-green-600 font-bold text-3xl mt-3">
                  {quickView.price}
                </p>

                <button className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
