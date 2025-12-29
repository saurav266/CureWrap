import React from "react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative text-white mt-20">
      {/* ======= MAIN FOOTER BG ======= */}
      <div className="bg-gradient-to-br from-blue-500 to-green-500 pt-16 pb-10 px-6 md:px-16 lg:px-24 shadow-xl">

        {/* ========= GRID SECTION ========= */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ================= COMPANY INFO ================= */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-wide">
              Cure<span className="text-white/90">Wrap</span>
            </h1>

            <p className="text-sm flex items-start gap-2 opacity-90 leading-relaxed">
              <CiLocationOn className="text-xl mt-[2px]" />
              OMM KRIYANAS MART LLP <br />
              B901 DNR Casablanca, <br />
              Mahadevpura Main Road, <br />
              Bangalore - 560048
            </p>

            <a
              href="mailto:support@curewrapplus.com"
              className="text-sm flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <MdOutlineForwardToInbox className="text-xl" />
              support@curewrapplus.com
            </a>

            <a
              href="https://wa.me/8123131143"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <FaWhatsapp className="text-xl" />
              +91  81231 31143
            </a>

            {/* Social Icons */}
            <div className="flex gap-4 mt-3">
              <a
                href="https://www.instagram.com/curewrapplus/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 shadow-lg cursor-pointer hover:scale-110 transition"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61561920090630"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg cursor-pointer hover:scale-110 transition"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* ================= INFORMATION ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/about" className="hover:underline hover:text-white transition">About CureWrap</Link></li>
              <li><Link to="/product" className="hover:underline hover:text-white transition">Product</Link></li>
              <li><Link to="/contact" className="hover:underline hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:underline hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:underline hover:text-white transition">Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:underline hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* ================= USEFUL LINKS ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/contact" className="hover:underline hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:underline hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* ========= COPYRIGHT WITH RESPONSIVE ALIGNMENT ========= */}
        <div className="mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Developer credit */}
          {/* <span className="text-white/70 text-xs md:text-sm text-center md:text-left">
            Website developed by <span className="font-medium">TRIONEX INDIA</span>
          </span> */}

          {/* Copyright */}
          <span className="text-white/90 text-sm text-center">
            © {new Date().getFullYear()} CureWrap. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}