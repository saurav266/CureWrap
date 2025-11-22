// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegHeart, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx"; // import your AuthContext
import { assets } from "../../assets/frontend_assets/assets.js"; // adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `relative group transition-all duration-300 font-semibold tracking-wide
    ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500 hover:scale-110 hover:-translate-y-0.5"}
    hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]`;

  return (
    <div className="flex items-center justify-between px-6 h-16 bg-white/70 backdrop-blur-xl shadow-md border-b border-gray-200/40">
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
                    className="
                        h-8 h-50 w-50 w-auto object-contain cursor-pointer
                        transition-all duration-500 
                        hover:scale-110 hover:rotate-2 hover:drop-shadow-lg
                    "
                />
            </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-8 text-lg items-center font-semibold tracking-wide">
        <NavLink to="/" className={navLinkClass}>HOME</NavLink>
        <NavLink to="/products" className={navLinkClass}>PRODUCT</NavLink>
        <NavLink to="/about" className={navLinkClass}>ABOUT</NavLink>
        <NavLink to="/contact" className={navLinkClass}>CONTACT</NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        {/* Wishlist */}
        <Link to="/watchlist">
          <FaRegHeart className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-green-500 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative group">
          <FaUserCircle className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-green-500 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]" />
          <div className="hidden group-hover:flex flex-col absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-3 animate-fadeIn">
            {isAuthenticated ? (
              <>
                <Link className="hover:text-green-600 text-gray-600 py-1">Profile</Link>
                <Link className="hover:text-green-600 text-gray-600 py-1">Orders</Link>
                <button
                  onClick={logout}
                  className="hover:text-green-600 text-gray-600 py-1 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-green-600 text-gray-600 py-1">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <FaShoppingCart className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-green-500 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]" />
          <span className="absolute -right-2 -bottom-2 w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center shadow-md">
            0
          </span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-2xl text-gray-700 hover:text-green-500 transition-transform duration-300 hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-6 py-6 sm:hidden animate-fadeIn">
          <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>HOME</NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={() => setIsOpen(false)}>PRODUCT</NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setIsOpen(false)}>ABOUT</NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setIsOpen(false)}>CONTACT</NavLink>
          {!isAuthenticated && (
            <NavLink to="/login" className={navLinkClass} onClick={() => setIsOpen(false)}>LOGIN</NavLink>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;