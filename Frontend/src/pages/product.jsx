import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart, AiOutlineEye } from "react-icons/ai";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [animateHeart, setAnimateHeart] = useState(null);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/products");
        const data = await res.json();

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Product added to cart!");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 px-6 md:px-12 bg-white font-productBody">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-14 font-productTitle">
          OUR PRODUCTS
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
        >
          {products.map((p) => (
            <motion.div
              key={p._id}
              variants={cardAnimation}
              className="relative bg-white shadow-md hover:shadow-xl transition p-3 pb-5 overflow-hidden"
            >
              {p.discount && (
                <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full font-productBody">
                  {p.discount}
                </div>
              )}

              {animateHeart === p._id && (
                <AiFillHeart className="text-red-500 text-4xl absolute top-8 right-10 animate-floatUp opacity-0" />
              )}

              <div className="relative w-full h-[330px] overflow-hidden group">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-3 right-3 flex flex-col gap-3 opacity-0 translate-y-2 
                  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                  <div className="relative group/icon">
                    <button
                      onClick={() => {
                        setAnimateHeart(p._id);
                        setTimeout(() => setAnimateHeart(null), 800);
                      }}
                      className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <AiOutlineHeart size={24} className="text-gray-800" />
                    </button>
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                      bg-white shadow px-2 py-1 rounded text-xs opacity-0 font-productBody
                      group-hover/icon:opacity-100 transition whitespace-nowrap">
                      Add to Wishlist
                    </span>
                  </div>

                  <div className="relative group/icon">
                    <button
                      onClick={() => setQuickView(p)}
                      className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <AiOutlineEye size={24} className="text-gray-800" />
                    </button>
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                      bg-white shadow px-2 py-1 rounded text-xs opacity-0 font-productBody 
                      group-hover/icon:opacity-100 transition whitespace-nowrap">
                      Quick View
                    </span>
                  </div>
                </div>
              </div>

              <Link to={`/product/${p._id}`}>
                <h3 className="text-xl font-semibold hover:text-green-600">
                  {p.name}
                </h3>
              </Link>

              <p className="text-gray-600 mt-1">
                {p.description || "No description available."}
              </p>

              <p className="text-green-600 font-bold text-lg mt-3">
                ₹{p.price} {p.currency}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => addToCart(p)}
                  className="w-1/2 py-2 border rounded bg-yellow-500 text-white font-semibold"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${p._id}`}
                  className="w-1/2 py-2 border rounded bg-green-600 text-white font-semibold text-center"
                >
                  View
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}