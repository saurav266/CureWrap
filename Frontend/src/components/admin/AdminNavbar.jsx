import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative group transition-all duration-300 font-semibold tracking-wide
   ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500 hover:scale-100 hover:-translate-y-0.5"}
   hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]`;

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
          className="
            h-50 w-auto object-contain cursor-pointer
          "
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-16 text-lg items-center font-semibold tracking-wide">
        <NavLink to="/admin" className={navLinkClass}>DASHBOARD</NavLink>
        <NavLink to="/admin/products" className={navLinkClass}>PRODUCT</NavLink>
        <NavLink to="/admin/orders" className={navLinkClass}>ORDER</NavLink>
        <NavLink to="/admin/users" className={navLinkClass}>USER</NavLink>
        <NavLink to="/admin/returns" className={navLinkClass}>RETURN</NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        {/* Profile Dropdown */}
        <div className="relative group hidden sm:block">
          <FaUserCircle className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-green-500 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]" />
          <div className="hidden group-hover:flex flex-col absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-3 animate-fadeIn">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-green-600 text-gray-600 py-1">Profile</Link>
                
                <button onClick={logout} className="hover:text-green-600 text-gray-600 py-1 text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-green-600 text-gray-600 py-1">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-2xl text-gray-700 hover:text-green-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-md flex flex-col items-center gap-6 py-6 sm:hidden animate-fadeIn">
          <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>DASHBOARD</NavLink>
          <NavLink to="/product" className={navLinkClass} onClick={() => setMobileOpen(false)}>PRODUCT</NavLink>
          <NavLink to="/order" className={navLinkClass} onClick={() => setMobileOpen(false)}>ORDER</NavLink>
          <NavLink to="/user" className={navLinkClass} onClick={() => setMobileOpen(false)}>USER</NavLink>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-green-600 text-gray-600" onClick={() => setMobileOpen(false)}>Profile</Link>
             
              <button onClick={() => { logout(); setMobileOpen(false); }} className="hover:text-green-600 text-gray-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-green-600 text-gray-600" onClick={() => setMobileOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;