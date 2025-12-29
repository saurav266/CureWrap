import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

import { assets } from "../assets/frontend_assets/assets";
import postureImg from "../assets/frontend_assets/curewrap/frontPostureBelt.png";
import housewife from "../assets/frontend_assets/curewrap/lsBelt.png";
import rehabilitation from "../assets/frontend_assets/curewrap/kneeBrace.png";

const backendUrl = "http://localhost:8000"; // Adjust as needed

const brandGradient = "bg-gradient-to-r from-[#2F86D6]/80 to-[#63B46B]/80";

const activities = [
  { name: "Gym / Workout", slug: "gym_workout", img: assets.gym },
  { name: "Pain / Injury Relief", slug: "pain_relief", img: housewife },
  { name: "Office / Posture", slug: "office_posture", img: postureImg },
  { name: "Rehabilitation", slug: "rehabilitation", img: rehabilitation }
];

/* 🔥 PRODUCT ID–BASED MAPPING (ROCK SOLID) */
const activityMap = {
  gym_workout: [
    "692711b3c97c569366415213", // Knee Brace
    "6929c183b6489355ea3c6b21", // LS Lumbar Belt
  ],
  pain_relief: [
    "6929c183b6489355ea3c6b21", // LS Lumbar Belt
    "6929aef0b6489355ea3c5a25", // LS Contoured Belt
    "692711b3c97c569366415213", // Knee Brace
    "69270418d8a75f130faf4d66", // Hinged Knee
  ],
  office_posture: [
    "6932ab49ac77b4f2a0ad736e", // Posture Corrector Belt
     "6929c183b6489355ea3c6b21", // LS Lumbar Belt
  ],
  rehabilitation: [
    "69270418d8a75f130faf4d66", // Hinged Knee
    "6929aef0b6489355ea3c5a25", // LS Contoured Belt
  ],
};

export default function ShopByActivitySection() {
  const navigate = useNavigate();

  const [popup, setPopup] = useState(false);
  const [popupProducts, setPopupProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products only once
  useEffect(() => {
    fetch(`${backendUrl}/api/users/products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []));
  }, []);

  // Open popup based on activity match (using _id)
  const handleActivityClick = (slug) => {
    const idList = activityMap[slug];
    const filtered = allProducts.filter((p) => idList.includes(p._id));
    setPopupProducts(filtered);
    setPopup(true);
  };

  return (
    <section className="py-20 px-4 md:px-12 lg:px-20 bg-white">
      {/* TITLE */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Shop by Activity
        </motion.h2>
        <motion.p className="text-gray-600 text-lg md:text-xl mt-4">
          Choose the right supportive gear that empowers your lifestyle.
        </motion.p>
        <div className="mx-auto mt-6 w-24 h-1 rounded-full bg-green-500"></div>
      </div>

      {/* ACTIVITY GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {activities.map((activity, idx) => (
          <motion.div
            key={idx}
            onClick={() => handleActivityClick(activity.slug)}
            className="group relative block overflow-hidden rounded-2xl shadow-xl cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={activity.img}
              alt={activity.name}
              className="w-full h-[380px] object-cover transition-all duration-700 group-hover:scale-110"
            />

            <div className={`absolute inset-0 opacity-0 group-hover:opacity-80 transition-all duration-500 ${brandGradient}`} />

            <div
              className="absolute bottom-0 left-0 w-full bg-green-600 text-white py-2 px-4 text-lg font-semibold transform -skew-y-3 opacity-100
              group-hover:opacity-0 transition-all duration-500"
            >
              {activity.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* POPUP MODAL */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-xl"
          >
            <Toaster position="relative top-right" />

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setPopup(false)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-full h-9 w-9 flex justify-center items-center text-xl font-bold transition"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Related Products
            </h2>

            {popupProducts.length === 0 ? (
              <p className="text-center text-gray-600">No products found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {popupProducts.map((p) => (
                  <div
                    key={p._id}
                    className="border rounded-xl p-4 shadow hover:shadow-md transition"
                  >
                    <img
                      src={
                        p.images?.[0]?.url?.startsWith("http")
                          ? p.images[0].url
                          : `${backendUrl}/${p.images?.[0]?.url}`
                      }
                      className="w-full h-48 object-contain rounded mb-3"
                      alt={p.name}
                    />

                    <p className="font-semibold text-gray-900 text-lg line-clamp-2">{p.name}</p>
                    <p className="text-green-700 font-bold mt-1 mb-4 text-lg">
                      ₹{(p.sale_price || p.price).toLocaleString()}
                    </p>

                    {/* BUTTONS */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          let cart = JSON.parse(localStorage.getItem("cart")) || [];
                          cart.push({
                            productId: p._id,
                            quantity: 1,
                            price: p.sale_price || p.price,
                            name: p.name,
                            image: p.images?.[0]?.url
                              ? (p.images[0].url.startsWith("http")
                                  ? p.images[0].url
                                  : `${backendUrl}/${p.images[0].url}`)
                              : "",
                          });
                          localStorage.setItem("cart", JSON.stringify(cart));
                          window.dispatchEvent(new Event("cartUpdated"));
                          toast.success("Added to cart!");
                        }}
                        className="flex-1 py-2 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}