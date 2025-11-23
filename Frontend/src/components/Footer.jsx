import React from "react";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

export default function Footer() {
  return (
    <footer className="relative text-white mt-20">

      {/* ======= MAIN FOOTER BG ======= */}
      <div className="bg-gradient-to-br from-blue-500 to-green-500 pt-20 pb-14 px-6 md:px-20  shadow-xl">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ================= COMPANY INFO ================= */}
          <div>
            <h1 className="text-3xl font-extrabold mb-4 tracking-wide">
              Cure<span className="text-white/90">Wrap</span>
            </h1>

            <p className="text-sm mb-4 flex items-center gap-2 opacity-90">
              <CiLocationOn className="text-xl" />
              435 Science Dr, Moorpark CA 93021, USA
            </p>

            <a
              href="#"
              className="text-sm mb-3 flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <MdOutlineForwardToInbox className="text-xl" />
              support@CureWrap.com
            </a>

            <a
              href="#"
              className="text-sm mb-5 flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition"
            >
              <FaWhatsapp className="text-xl" /> +1 (805) 517-4839
            </a>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              {[
                { icon: <FaInstagram />, color: "from-pink-500 to-yellow-500" },
                { icon: <FaYoutube />, color: "from-red-500 to-red-700" },
              ].map((social, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-full bg-gradient-to-br ${social.color} shadow-lg cursor-pointer hover:scale-110 transition transform`}
                >
                  {social.icon}
                </div>
              ))}
            </div>
          </div>

          {/* ================= BEST SELLERS ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Best Sellers</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                "Knee Brace for Knee Pain",
                "Adjustable Knee Brace",
                "Elbow Compression Support Sleeve",
                "Knee Brace for Lower Back Pain",
                "Lower Back Brace with 5 Stays",
                "Ankle Support Sleeve",
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:underline hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= INFORMATION ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {[
                "About CureWrap",
                "Reviews",
                "Product Registration",
                "Wholesale",
                "Affiliate",
                "Contact Us",
                "Privacy Policy",
                "Refund Policy",
                "Terms of Service",
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:underline hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= USEFUL LINKS ================= */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {["Contact Us", "Blog"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:underline hover:text-white transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 text-center text-white/90 text-sm border-t border-white/20 pt-6">
          © {new Date().getFullYear()} CureWrap. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
