import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import { FaRegHeart, FaUserCircle, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();

    const navLinkClass = ({ isActive }) =>
        `relative group transition-all duration-300 font-semibold tracking-wide
        ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500 hover:scale-110 hover:-translate-y-0.5"}
        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]`;

    return (
        <div className="
            flex items-center justify-between 
            font-medium px-6 h-16 
            bg-white/70 backdrop-blur-xl shadow-md 
            border-b border-gray-200/40 z-[200]
        ">

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
                        h-8 h-50 w-50 w-auto object-contain cursor-pointer"
                />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex gap-8 text-lg items-center font-semibold tracking-wide">
                
                {/* HOME */}
                <NavLink to="/" className={navLinkClass}>
                    HOME
                    <span className="
                        absolute left-1/2 -bottom-1 h-0.5 w-0 
                        bg-green-500 transition-all duration-300 
                        group-hover:w-full group-hover:left-0
                    "></span>
                </NavLink>

                {/* PRODUCT */}
                <NavLink to="/product" className={navLinkClass}>
                    PRODUCT
                    <span className="
                        absolute left-1/2 -bottom-1 h-0.5 w-0 
                        bg-green-500 transition-all duration-300 
                        group-hover:w-full group-hover:left-0
                    "></span>
                </NavLink>

                {/* ABOUT */}
                <NavLink to="/about" className={navLinkClass}>
                    ABOUT
                    <span className="
                        absolute left-1/2 -bottom-1 h-0.5 w-0 
                        bg-green-500 transition-all duration-300 
                        group-hover:w-full group-hover:left-0
                    "></span>
                </NavLink>

                {/* CONTACT */}
                <NavLink to="/contact" className={navLinkClass}>
                    CONTACT
                    <span className="
                        absolute left-1/2 -bottom-1 h-0.5 w-0 
                        bg-green-500 transition-all duration-300 
                        group-hover:w-full group-hover:left-0
                    "></span>
                </NavLink>
            </ul>

            {/* Right Icons */}
            <div className="flex items-center gap-5">

                {/* Wishlist */}
                <Link to="/WatchList">
                    <FaRegHeart className="
                        h-8 w-8 cursor-pointer 
                        transition-all duration-300 
                        hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
                        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
                    " />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                    <FaUserCircle className="
                        h-8 w-8 cursor-pointer 
                        transition-all duration-300 
                        hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
                        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
                    " />

                    <div
                        className="
                            hidden group-hover:flex flex-col 
                            absolute right-0 mt-3 w-44 
                            bg-white/90 backdrop-blur-md 
                            shadow-xl rounded-lg 
                            p-3 animate-fadeIn
                        "
                    >
                        <Link className="hover:text-green-600 text-gray-600 py-1">Profile</Link>
                        <Link className="hover:text-green-600 text-gray-600 py-1">Orders</Link>
                        <Link className="hover:text-green-600 text-gray-600 py-1">Logout</Link>
                    </div>
                </div>

                {/* Cart */}
                <Link to="/cart" className="relative">
                    <FaShoppingCart className="
                        h-8 w-8 cursor-pointer 
                        transition-all duration-300 
                        hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
                        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
                    " />

                    <span className="
                        absolute -right-2 -bottom-2 
                        w-5 h-5 rounded-full 
                        bg-black text-white 
                        text-xs flex items-center justify-center
                        shadow-md
                    ">
                        0
                    </span>
                </Link>
            </div>
        </div>
    );
};



export default Navbar;
