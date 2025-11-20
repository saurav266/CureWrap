    import React from "react";
    import { Link, NavLink } from "react-router-dom";
    import { assets } from "../../assets/frontend_assets/assets.js";
    import { FaRegHeart, FaUserCircle, FaShoppingCart } from "react-icons/fa";

    const Navbar = () => {


    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all duration-300 
        ${isActive ? "text-black font-semibold" : "text-gray-600 hover:text-black"}`;

    return (
        <div className="flex items-center justify-between font-medium px-6 py-2 shadow-md bg-white">

        {/* Logo */}
        <img src={assets.logo} className="w-32 cursor-pointer" alt="logo" />

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 text-md">
            <NavLink to="/" className={navLinkClass}>
            HOME
            <span className="block w-0 group-hover:w-full h-[2px] bg-black transition-all duration-300"></span>
            </NavLink>
            <NavLink to="/product" className={navLinkClass}>
            PRODUCT
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
            ABOUT
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
            CONTACT
            </NavLink>
        </ul>

        {/* Right Icons */}
    
    <div className="flex items-center gap-6">
    <Link to="/WatchList" className="flex items-center gap-6">
    <FaRegHeart className="text-2xl cursor-pointer hover:scale-110 transition" />
    </Link>

    {/* Profile Dropdown */}
    <Link to="/profile" className="group relative">
    <FaUserCircle className="text-2xl cursor-pointer hover:scale-110 transition" />
    <div className="hidden group-hover:block absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
        <ul className="flex flex-col gap-2 py-3 px-5 text-gray-600">
        <li className="hover:text-black cursor-pointer">Profile</li>
        <li className="hover:text-black cursor-pointer">Orders</li>
        <li className="hover:text-black cursor-pointer">Logout</li>
        </ul>
    </div>
    </Link>

    {/* Cart */}
    <Link to="/cart" className="relative">
    <FaShoppingCart className="text-2xl cursor-pointer hover:scale-110 transition" />
    <span className="absolute -right-2 -bottom-2 w-5 h-5 flex items-center justify-center bg-black text-white text-xs rounded-full">
        0
    </span>
    </Link>
            
        </div>
        </div>
    );
    };

    export default Navbar;  