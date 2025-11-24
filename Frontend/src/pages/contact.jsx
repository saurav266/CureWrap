import React, { useState } from "react";
import { Send, MessageCircle, MapPin, Mail } from "lucide-react";
import CoupleExer_Outdoor from "../assets/Frontend_assets/contact/CoupleExer_Outdoor.png";
import unsplashYoga2 from "../assets/Frontend_assets/contact/unsplash_Yoga2.jpg";


import unsplashYoga from "../assets/Frontend_assets/contact/unsplash_Yoga.jpg";
import oldJogging from "../assets/Frontend_assets/contact/old_jogging.png";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting CureWrap! We will get back to you soon.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Images Grid - Matching Original */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="relative overflow-hidden rounded-lg shadow-md transform transition-all duration-500 hover:scale-105">
            <img
              src={CoupleExer_Outdoor}
              alt="Couple exercising outdoors"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md transform transition-all duration-500 hover:scale-105">
            <img
              src={unsplashYoga2}
              alt="Woman running with knee brace"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md transform transition-all duration-500 hover:scale-105">
            <img
              src={unsplashYoga}
              alt="Pregnant woman doing yoga"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md transform transition-all duration-500 hover:scale-105">
            <img
              src={oldJogging}
              alt="Seniors jogging together"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Heading - Teal Color */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold text-teal-500 text-center mb-8">
          We're Here to Help!
        </h1>

        {/* Description */}
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
          <p className="text-lg text-gray-700 leading-relaxed">
            At CureWrap, your comfort and satisfaction are our top priorities.
            We value your questions, comments, and feedback and are always ready
            to assist. Whether you need help choosing the right orthopedic wear,
            have questions about an order, or want to share your CureWrap
            success story, we'd love to hear from you!
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our friendly and knowledgeable customer support team is available to
            provide you with the answers and assistance you need. Simply fill
            out the contact form below, and we'll get back to you as soon as
            possible.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Chat Card */}
          <div
            onMouseEnter={() => setHoveredCard("chat")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`bg-white rounded-lg shadow-lg p-8 text-center transform transition-all duration-300 ${
              hoveredCard === "chat" ? "scale-105 shadow-xl" : ""
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-teal-500 p-6 rounded-full">
                <MessageCircle size={40} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-teal-500 mb-3">
              CHAT WITH US
            </h3>
            <p className="text-lg text-teal-600 font-medium">
              +1 (805) 517-4839
            </p>
          </div>

          {/* Location Card */}
          <div
            onMouseEnter={() => setHoveredCard("location")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`bg-white rounded-lg shadow-lg p-8 text-center transform transition-all duration-300 ${
              hoveredCard === "location" ? "scale-105 shadow-xl" : ""
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-teal-500 p-6 rounded-full">
                <MapPin size={40} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-teal-500 mb-3">
              VISIT OUR LOCATION
            </h3>
            <p className="text-lg text-gray-800 font-medium">
              405 Science Dr, Moonpark
            </p>
            <p className="text-lg text-gray-800 font-medium">CA 93021, USA</p>
          </div>

          {/* Email Card */}
          <div
            onMouseEnter={() => setHoveredCard("email")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`bg-white rounded-lg shadow-lg p-8 text-center transform transition-all duration-300 ${
              hoveredCard === "email" ? "scale-105 shadow-xl" : ""
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-teal-500 p-6 rounded-full">
                <Mail size={40} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-teal-500 mb-3">EMAIL</h3>
            <p className="text-lg text-teal-600 font-medium">
              support@curewrap.com
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-teal-500 text-center mb-12">
            For immediate response, tell us more about your concern:
          </h2>

          <div className="space-y-6">
            {/* First and Last Name Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("firstName")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-300 ${
                    focusedInput === "firstName"
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("lastName")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-300 ${
                    focusedInput === "lastName"
                      ? "border-teal-500 shadow-lg"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-300 ${
                  focusedInput === "email"
                    ? "border-teal-500 shadow-lg"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedInput("subject")}
                onBlur={() => setFocusedInput(null)}
                className={`w-full px-4 py-3 border-2 rounded-md transition-all duration-300 ${
                  focusedInput === "subject"
                    ? "border-teal-500 shadow-lg"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedInput("message")}
                onBlur={() => setFocusedInput(null)}
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-md resize-none transition-all duration-300 ${
                  focusedInput === "message"
                    ? "border-teal-500 shadow-lg"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-teal-500 text-white px-12 py-4 rounded-md font-bold text-lg hover:bg-teal-600 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
              >
                Send Message
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
