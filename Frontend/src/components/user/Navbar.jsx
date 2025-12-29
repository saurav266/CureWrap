import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import MiniCart from "./MiniCart.jsx";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiPokerHeartsLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

// ====== CONFIG ======
const backendUrl = "";

// Shared nav link style (desktop)
const navLinkClass = ({ isActive }) =>
  `relative group transition-all duration-300 font-semibold tracking-wide
   ${
     isActive
       ? "text-green-600"
       : "text-gray-700 hover:text-green-500 hover:scale-100 hover:-translate-y-0.5"
   }
   hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]`;

// Helper to build image url
const getImageUrl = (img) => {
  if (!img?.url) return "https://via.placeholder.com/200x200?text=Product";
  return img.url.startsWith("http")
    ? img.url
    : `${backendUrl}/${img.url.replace(/^\/+/, "")}`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // 👉 NEW: products for mega menu
  const [megaProducts, setMegaProducts] = useState([]);
  const [megaLoading, setMegaLoading] = useState(false);
  const [megaError, setMegaError] = useState("");

  // ---- Fetch mega menu products from backend ----
  useEffect(() => {
    const fetchMegaProducts = async () => {
      try {
        setMegaLoading(true);
        setMegaError("");
        // adjust query params as you want (limit, category, featured, etc.)
        const res = await fetch(`${backendUrl}/api/users/products?limit=5`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load products");
        }

        const list = Array.isArray(data.products) ? data.products : [];
        setMegaProducts(list);
      } catch (err) {
        console.error("Mega menu fetch error:", err);
        setMegaError("Failed to load products");
        setMegaProducts([]);
      } finally {
        setMegaLoading(false);
      }
    };

    fetchMegaProducts();
  }, []);

  // ---------------- Cart syncing ----------------
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const loadCart = () => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(items);
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".mini-cart") &&
        !e.target.closest("#cart-icon-btn")
      ) {
        setMiniCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- Add To Cart (for mega menu products) ----
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) => item.productId === product._id && !item.size && !item.color
    );

    if (existing) {
      existing.quantity += 1;
      cart = cart.map((item) =>
        item.productId === product._id && !item.size && !item.color
          ? existing
          : item
      );
    } else {
      cart.push({
        ...product,
        productId: product._id,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    // toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="
      flex items-center justify-between 
      font-medium px-6 h-16 
      bg-white/70 backdrop-blur-xl shadow-md 
      border-b border-gray-200/40 z-[200]
    "
    >
      {/* Logo */}
      <Link
        to="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        className="flex items-center"
      >
        <img
          src={assets.logo}
          alt="logo"
          className="h-35 w-auto object-contain cursor-pointer"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-16 text-lg items-center font-semibold tracking-wide">
        <NavLink to="/" className={navLinkClass}>
          HOME
          <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </NavLink>

        {/* PRODUCT WITH MEGA MENU */}
        <li className="relative group">
          <NavLink to="/product" className={navLinkClass}>
            PRODUCT
            <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
          </NavLink>

          {/* Mega menu */}
          <div
            className="
              absolute left-1/2 top-[115%] -translate-x-1/2
              bg-white shadow-lg py-5 px-6 z-[999] rounded-md

              opacity-0 pointer-events-none translate-y-3
              transition-all duration-300 ease-out

              group-hover:opacity-100
              group-hover:translate-y-0
              group-hover:pointer-events-auto

              w-auto max-w-[90vw]
            "
          >
            {megaLoading ? (
              <div className="text-gray-500 px-4 py-2 text-sm">
                Loading products...
              </div>
            ) : megaError ? (
              <div className="text-red-500 px-4 py-2 text-sm">
                {megaError}
              </div>
            ) : megaProducts.length === 0 ? (
              <div className="text-gray-500 px-4 py-2 text-sm">
                No products available
              </div>
            ) : (
              <div className="flex gap-4 flex-nowrap">
                {megaProducts.map((p) => {
                  const price = p.sale_price || p.price || 0;
                  const img = getImageUrl(p.images?.[0]);

                  return (
                    <div
                      key={p._id}
                      className="
                        bg-gray-50 shadow-sm hover:shadow-md
                        transition p-2 flex gap-2
                        h-24 w-48 shrink-0 rounded-md cursor-pointer
                      "
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      <div className="w-[40%] h-full">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="w-[60%] flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-xs text-gray-900 leading-tight line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="text-green-600 font-bold text-xs mt-1">
                            ₹{price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          className="
                            bg-green-600 text-white text-[11px]
                            py-1 rounded-md w-full 
                            hover:bg-green-700 transition
                          "
                          aria-label={`Add ${p.name} to cart`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </li>

        <NavLink to="/about" className={navLinkClass}>
          ABOUT
          <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </NavLink>

        <NavLink to="/contact" className={navLinkClass}>
          CONTACT
          <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-10">
        {/* 🔁 FIXED: route to /wishlist */}
        <Link to="/wishlist">
          <RiPokerHeartsLine
            className="
            h-7 w-7 cursor-pointer 
            transition-all duration-300 
            hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
            hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
          "
          />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative group/profile inline-block">
          <FiUser
            className="
            h-7 w-7 cursor-pointer 
            transition-all duration-300 
            hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
          "
          />

          <div
            className="
              absolute right-0 top-full mt-1 w-44
              bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-3 z-50

              opacity-0 translate-y-2 pointer-events-none
              transition-all duration-300 ease-out

              group-hover/profile:opacity-100 
              group-hover/profile:translate-y-0 
              group-hover/profile:pointer-events-auto
            "
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hover:text-green-600 text-gray-600 py-1 block"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="hover:text-green-600 text-gray-600 py-1 block"
                >
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-green-600 text-gray-600 py-1 block"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hover:text-green-600 text-gray-600 py-1 block"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="relative">
          <button
            id="cart-icon-btn"
            onClick={() => setMiniCartOpen((prev) => !prev)}
            className="relative"
          >
            <AiOutlineShoppingCart
              className="h-7 w-7 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-green-500"
            />
            <span className="absolute -right-2 -bottom-2 w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          </button>

          {/* Mini Cart Component */}
          <MiniCart
            open={miniCartOpen}
            cart={cart}
            onClose={() => setMiniCartOpen(false)}
          />
        </div>

        {/* Hamburger */}
        <button
          className="sm:hidden text-2xl text-gray-700 hover:text-green-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="
          absolute top-16 left-0 w-full 
          bg-white/95 backdrop-blur-md 
          shadow-md flex flex-col items-center gap-6 py-6 sm:hidden
        "
        >
          {/* Mobile links */}
          {["/", "/product", "/about", "/contact"].map((path, i) => {
            const labels = ["HOME", "PRODUCT", "ABOUT", "CONTACT"];
            return (
              <NavLink
                key={path}
                to={path}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {labels[i]}
              </NavLink>
            );
          })}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-green-600"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                className="text-gray-600 hover:text-green-600"
              >
                Orders
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-green-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-600 hover:text-green-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
