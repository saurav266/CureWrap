import React from 'react';
import {  FaWhatsapp,FaInstagram, FaYoutube, } from 'react-icons/fa';
import { MdOutlineForwardToInbox } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h1 className="text-3xl font-semibold mb-4 ">CureWrap</h1>
          <p className="text-sm mb-4  flex item-center">
            < CiLocationOn  className="text-white text-lg" />
            435 Science Dr, Moorpark CA 93021, USA</p>
          <a href='#' className="text-sm mt-2  mb-4  flex item-center underline">
            <MdOutlineForwardToInbox className="text-white text-lg"  />support@modvel.com</a>
          <a href='#' className="text-sm mt-2 mb-4 flex item-center underline">
             <FaWhatsapp className="text-white text-lg" />
            +1 (805) 517-4839</a>
          <div className="flex space-x-1">
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-white" />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube className="text-xl hover:text-white" />
            </a>
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <h3 className="text-2xl font-semibold mb-5">Best Sellers</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Knee Brace for Knee Pain</a></li>
            <li><a href="#" className="hover:underline">Adjustable Knee Brace</a></li>
            <li><a href="#" className="hover:underline">Elbow Compression Support Sleeve</a></li>
            <li><a href="#" className="hover:underline">Knee Brace for Lower Back Pain</a></li>
            <li><a href="#" className="hover:underline">Lower Back Brace with 5 Stays</a></li>
            <li><a href="#" className="hover:underline">Ankle Support Sleeve</a></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-2xl font-semibold mb-5">Information</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About Modvel</a></li>
            <li><a href="#" className="hover:underline">Reviews</a></li>
            <li><a href="#" className="hover:underline">Product Registration</a></li>
            <li><a href="#" className="hover:underline">Wholesale</a></li>
            <li><a href="#" className="hover:underline">Affiliate</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Refund Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-5">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;