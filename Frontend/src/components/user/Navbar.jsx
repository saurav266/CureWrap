import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";
import { RiPokerHeartsLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = () => {
    const navigate = useNavigate();

    const navLinkClass = ({ isActive }) =>
        `relative group transition-all duration-300 font-semibold tracking-wide
        ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500 hover:scale-100 hover:-translate-y-0.5"}
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
            <ul className="hidden sm:flex gap-16 text-lg items-center font-semibold tracking-wide">
                
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
                {/* PRODUCT with working click + hover mega menu */}
                <li className="relative group">

                    {/* CLICKABLE PRODUCT LINK */}
                    <NavLink
                        to="/product"
                        className={navLinkClass}
                    >
                        PRODUCT
                        <span className="
                            absolute left-1/2 -bottom-1 h-0.5 w-0 
                            bg-green-500 transition-all duration-300 
                            group-hover:w-full group-hover:left-0
                        "></span>
                    </NavLink>

                    {/* HOVER MEGA MENU */}
                    <div
                        className="
                            absolute left-1/2 top-[115%]   /* 👈 keeps menu BELOW PRODUCT so clicks work */
                            -translate-x-1/2
                            bg-white shadow-lg
                            py-5 px-6 z-[999]

                            opacity-0 pointer-events-none translate-y-3
                            transition-all duration-300 ease-out

                            group-hover:opacity-100
                            group-hover:translate-y-0
                            group-hover:pointer-events-auto

                            w-auto max-w-[90vw]
                        "
                    >
                        {/* <h2 className="text-base font-semibold mb-3 text-gray-700 text-center">
                            Featured Products
                        </h2> */}

                        {/* PRODUCT ROW */}
                        <div className="flex gap-4 flex-nowrap">

                            {[
                                { title: "Product 1", price: "₹25.00" },
                                { title: "Product 2", price: "₹35.00" },
                                { title: "Product 3", price: "₹40.00" },
                                { title: "Product 4", price: "₹50.00" },
                                { title: "Product 5", price: "₹60.00" },
                            ].map((p, i) => (
                                <div
                                    key={i}
                                    className="
                                        bg-gray-50  
                                        shadow-sm hover:shadow-md
                                        transition p-2 flex gap-2
                                        h-24 w-48 shrink-0
                                    "
                                >
                                    <div className="w-[40%] h-full">
                                        <img
                                            src='https://via.placeholder.com/200x200'
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="w-[60%] flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-xs text-gray-900 leading-tight">
                                                {p.title}
                                            </h3>
                                            <p className="text-green-600 font-bold text-xs mt-1">
                                                {p.price}
                                            </p>
                                        </div>

                                        <button className="
                                            bg-green-600 text-white text-[11px]
                                            py-1 rounded-md w-full 
                                            hover:bg-green-700 transition
                                        ">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </li>



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
            <div className="flex items-center gap-10">

                {/* Wishlist */}
                <Link to="/WatchList">
                    <RiPokerHeartsLine className="
                        h-7 w-7 cursor-pointer 
                        transition-all duration-300 
                        hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
                        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
                    " />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group/profile inline-block">
                    <FiUser className="
                        h-7 w-7 cursor-pointer 
                        transition-all duration-300 
                        hover:scale-125 hover:text-green-500 hover:-translate-y-0.5
                        hover:drop-shadow-[0_4px_6px_rgba(34,197,94,0.35)]
                    " />

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
                    <Link to="/profile" className="hover:text-green-600 text-gray-600 py-1 block">Profile</Link>
                    <Link to="/orders" className="hover:text-green-600 text-gray-600 py-1 block">Orders</Link>
                    <Link to="/logout" className="hover:text-green-600 text-gray-600 py-1 block">Logout</Link>
                    <Link to="/login" className="hover:text-green-600 text-gray-600 py-1 block">Login</Link>
                </div>
            </div>


                {/* Cart */}
                <Link to="/cart" className="relative">
                    <AiOutlineShoppingCart className="
                        h-7 w-7 cursor-pointer 
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