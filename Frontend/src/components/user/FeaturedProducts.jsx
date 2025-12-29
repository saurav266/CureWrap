import React, { useRef, useState, useEffect } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import lsBelt from "../../assets/Frontend_assets/curewrap/lsBelt.png";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";
const backendUrl = "http://localhost:8000";

// ✅ Only these product IDs will be featured
const FEATURED_IDS = [
  "69270418d8a75f130faf4d66",
  "692711b3c97c569366415213",
  "6929aef0b6489355ea3c5a25",
  "6929c183b6489355ea3c6b21",
  "6932ab49ac77b4f2a0ad736e",
];

// fallback (if backend fails)
const fallbackProducts = [
  {
    id: 1,
    title: "Curewrap Compression Knee Sleeves",
    price: "₹25.00",
    img: lsBelt,
    discount: "-18%",
    thumbs: [lsBelt],
  },
];

export default function FeaturedProductsCinematicSquareModal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(fallbackProducts);
  const [wishlist, setWishlist] = useState([]);
  const [heartBurstId, setHeartBurstId] = useState(null);
  const cardRefs = useRef({});

  // ✅ Fetch only featured products by ID
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/products?limit=50`);
        const data = await res.json();
        const fetched = Array.isArray(data.products) ? data.products : [];

        if (!fetched.length) return;

        // 🔥 Filter only required IDs
        const filtered = fetched.filter((p) =>
          FEATURED_IDS.includes(p._id)
        );

        if (!filtered.length) return;

        const formatted = filtered.map((p) => {
          const base = Number(p.price) || 0;
          const sale = p.sale_price ?? null;
          const final = sale ?? base;

          const discount =
            sale && base
              ? `-${Math.round(((base - sale) / base) * 100)}%`
              : "-0%";

          const imgs = Array.isArray(p.images) ? p.images : [];
          const imgUrls = imgs.map((img) =>
            img?.url?.startsWith("http")
              ? img.url
              : `${backendUrl}/${(img?.url || "").replace(/^\/+/, "")}`
          );
          const mainImg = imgUrls[0] || lsBelt;

          return {
            id: p._id,
            title: p.name,
            price: `₹${final.toLocaleString()}`,
            img: mainImg,
            discount,
            thumbs: imgUrls.length ? imgUrls : [mainImg],
            _raw: p,
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.error("Error fetching featured products", err);
      }
    };

    fetchProducts();
  }, []);

  // Wishlist persistence
  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (id) => wishlist.includes(id);

  const triggerHeartBurst = (id) => {
    setHeartBurstId(id);
    setTimeout(() => setHeartBurstId(null), 900);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id))
        return prev.filter((pid) => pid !== product.id);

      triggerHeartBurst(product.id);
      toast.success("Added to wishlist");
      return [...prev, product.id];
    });
  };

  // Add to cart
  const addToCart = (product) => {
    const raw = product._raw || {};
    const price =
      raw.sale_price ??
      raw.price ??
      Number(product.price?.toString().replace(/[₹,]/g, "") || 0);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      productId: raw._id || product.id,
      name: raw.name || product.title,
      quantity: 1,
      price,
      image: product.img,
      color: raw.colors?.[0]?.color || null,
      size:
        raw.colors?.[0]?.sizes?.[0]?.size ||
        raw.variants?.[0]?.size ||
        null,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  return (
    <>
      <Toaster position="top-right" />

      <section className="py-14 md:py-20 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            Featured Products
          </h2>

          <Swiper
            modules={[Autoplay, FreeMode, Pagination]}
            spaceBetween={20}
            grabCursor
            loop={products.length > 1}
            autoplay={{ delay: 3100, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 1.7 },
              768: { slidesPerView: 2.3 },
              1024: { slidesPerView: 3.2 },
              1400: { slidesPerView: 4 },
            }}
            className="!pb-12"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div className="relative h-[420px] lg:h-[480px] rounded-2xl bg-white/30 backdrop-blur-md shadow-xl overflow-hidden group cursor-pointer">

                  <div onClick={() => navigate(`/product/${p.id}`)}>
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        background: `linear-gradient(90deg, ${brandBlue}, ${brandGreen})`,
                      }}
                    >
                      {p.discount}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="bg-white p-3 rounded-full shadow"
                    >
                      {isWishlisted(p.id) ? (
                        <AiFillHeart className="text-red-500" size={18} />
                      ) : (
                        <AiOutlineHeart className="text-gray-800" size={18} />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.id}`);
                      }}
                      className="bg-white p-3 rounded-full shadow"
                    >
                      <AiOutlineEye className="text-gray-800" size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between">
                      <div className="max-w-[180px]">
                        <h3 className="text-base font-semibold text-black truncate">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-bold text-lg">
                            {p._raw?.sale_price
                              ? `₹${p._raw.sale_price.toLocaleString()}`
                              : p.price}
                          </span>
                          {p._raw?.sale_price && (
                            <span className="text-red-700 line-through text-sm">
                              ₹{p._raw.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="bg-white/70 backdrop-blur-xl border border-white/60 w-10 h-10 flex items-center justify-center rounded-full shadow hover:scale-110 transition"
                      >
                        <AiOutlineShoppingCart
                          size={18}
                          className="text-green-700"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
