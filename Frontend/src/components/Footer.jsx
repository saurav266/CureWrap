import React from "react";
import { FaWhatsapp, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative text-white mt-20">
      {/* ======= MAIN FOOTER BG ======= */}
      <div className="bg-gradient-to-br from-blue-500 to-green-500 pt-20 pb-14 px-6 md:px-20 shadow-xl">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ================= COMPANY INFO ================= */}
          <div>
            <h1 className="text-3xl font-extrabold mb-4 tracking-wide">
              Cure<span className="text-white/90">Wrap</span>
            </h1>

            <p className="text-sm mb-4 flex items-start gap-2 opacity-90 leading-relaxed">
              <CiLocationOn className="text-xl mt-[2px]" />
              Omm Kriyanash Mart LLP,
              Flat B-901, DNR CasablangA,
              Mahadevapura, Bangalore – 560048,
              Karnataka, India
            </p>

            <a
              href="mailto:support@curewrapplus.com"
              className="text-sm mb-3 flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <MdOutlineForwardToInbox className="text-xl" />
              support@curewrapplus.com
            </a>

            <a
              href="https://wa.me/918123131143"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mb-5 flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <FaWhatsapp className="text-xl" />
              +91 8123131143
            </a>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
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
                className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg cursor-pointer hover:scale-110 transition"
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

        {/* COPYRIGHT */}
        <div className="mt-12 border-t border-white/20 pt-6 flex items-center justify-center relative">
          
          {/* LEFT SIDE — Developer credit */}
          <span className="absolute left-6 md:left-10 text-white/70 text-xs md:text-sm">
            website is developed by TRIONEX INDIA
          </span>

          {/* CENTER — Copyright */}
          <span className="text-white/90 text-sm text-center">
            © {new Date().getFullYear()} CureWrap. All Rights Reserved.
          </span>

        </div>

      </div>
    </footer>
  );
}
