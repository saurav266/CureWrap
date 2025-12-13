// ContactUsPremium.jsx
import React, { useState } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Send, MessageCircle, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import CoupleExer_Outdoor from "../assets/Frontend_assets/contact/CoupleExer_Outdoor.png";
import unsplashYoga from "../assets/Frontend_assets/contact/unsplash_Yoga.jpg";
import oldJogging from "../assets/Frontend_assets/contact/old_jogging.png";
import contact from "../assets/Frontend_assets/contact/contact.jpg";
import { assets } from "../assets/admin_assets/assets.js";

const logoUrl = assets.logo;
const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

// BACKEND URL
const BACKEND_URL = "";

export default function ContactUsPremium() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { scrollYProgress } = useViewportScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 VALIDATION
    if (!formData.firstName.trim()) {
      toast.error("First name is required ❗");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Enter a valid email address ❗");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message cannot be empty ❗");
      return;
    }

    setSending(true);

    fetch(`${BACKEND_URL}/api/contact/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);

        if (data.success) {
          toast.success("Message sent successfully 🎉");

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
          });

          setSent(true);
          setTimeout(() => setSent(false), 2500);
        } else {
          toast.error(data.message || "Failed to send message ❌");
        }
      })
      .catch(() => {
        setSending(false);
        toast.error("Something went wrong ❌ Try again!");
      });
  };

  return (
    <div className="antialiased text-gray-800 bg-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* HERO */}
      <section className="relative w-full h-[66vh] md:h-[78vh] lg:h-[86vh] overflow-hidden">
        <motion.img
          src={contact}
          style={{ y }}
          initial={{ scale: 1.02, opacity: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent" />

        {/* floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute left-6 top-10 md:left-16 md:top-20 flex flex-col gap-5 z-30"
        >
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg flex items-center gap-3 w-56">
            <MessageCircle className="w-6 h-6 text-teal-600" />
            <div>
              <div className="text-xs text-gray-600">Customer Care</div>
              <div className="font-semibold text-gray-900">Chat Anytime</div>
            </div>
          </div>
        </motion.div>

        {/* center logo + heading */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-5 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full"
          >
            <img src={logoUrl} alt="logo" className="h-24 w-auto object-contain" />
            <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight">
              Contact <span style={{ color: brandBlue }}>Cure</span>
              <span style={{ color: brandGreen }} className="ml-1">Wrap</span>
            </h1>
          </motion.div>
        </div>

        {/* curved SVG bottom wave */}
        <div className="absolute left-0 right-0 bottom-0">
          <svg viewBox="0 0 1440 120" className="w-full h-[120px]" preserveAspectRatio="none">
            <path d="M0,40 C200,120 400,0 720,24 C1040,48 1240,120 1440,80 L1440 120 L0 120 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-10">
        {/* intro + cards */}
        <section className="bg-white py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                We're Here to Help
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Need product help or order support? Contact us anytime — we respond quickly.
              </p>
            </div>

            {/* contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  type: "whatsapp",
                  title: "WhatsApp",
                  desc: "+91-81213131143",
                  icon: <MessageCircle className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-br from-[#25D366] to-[#128C7E]",
                  href: "https://wa.me/81213131143",
                },
                {
                  type: "email",
                  title: "Email",
                  desc: "support@curewrapplus.com",
                  icon: <Mail className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-br from-[#2F86D6] to-[#63B46B]",
                  href: "mailto:support@curewrapplus.com",
                },
              ].map((c) => (
                <motion.a
                  key={c.type}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredCard(c.type)}
                  onMouseLeave={() => setHoveredCard(null)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`rounded-2xl p-6 shadow-lg transition-all ${
                    hoveredCard === c.type ? "scale-105 shadow-2xl" : ""
                  }`}
                >
                  <div className={`rounded-xl px-3 py-2 inline-flex items-center justify-center ${c.bg}`}>
                    {c.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* form + collage */}
        <section className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-stretch">

            {/* FORM */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 h-full min-h-[650px] flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tell us more</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName"].map((field, idx) => (
                  <div key={idx}>
                    <label className="text-sm text-gray-600">
                      {field === "firstName" ? "First name" : "Last name"}
                    </label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput(field)}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full px-4 py-3 rounded-lg mt-1 border transition duration-300 ${
                        focusedInput === field
                          ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_25px_rgba(47,134,214,0.12)]"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <label className="text-sm text-gray-600 mt-4">Email*</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                className={`w-full px-4 py-3 rounded-lg mt-1 border transition duration-300 ${
                  focusedInput === "email"
                    ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_25px_rgba(47,134,214,0.12)]"
                    : "border-gray-300"
                }`}
              />

              <label className="text-sm text-gray-600 mt-4">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedInput("subject")}
                onBlur={() => setFocusedInput(null)}
                className={`w-full px-4 py-3 rounded-lg mt-1 border transition duration-300 ${
                  focusedInput === "subject"
                    ? "border-[rgba(99,180,107,0.85)] shadow-[0_8px_25px_rgba(99,180,107,0.10)]"
                    : "border-gray-300"
                }`}
              />

              <label className="text-sm text-gray-600 mt-4">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedInput("message")}
                onBlur={() => setFocusedInput(null)}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg mt-1 border resize-none transition duration-300 ${
                  focusedInput === "message"
                    ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_25px_rgba(47,134,214,0.12)]"
                    : "border-gray-300"
                }`}
              />

              <div className="mt-6 flex flex-col items-start gap-2">
                <button
                  type="submit"
                  disabled={sending}
                  className={`flex items-center gap-3 text-white px-7 py-3.5 rounded-xl font-semibold shadow-xl text-base transition ${
                    sending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#2F86D6] to-[#63B46B] hover:scale-[1.04]"
                  }`}
                >
                  {sending ? "Sending..." : sent ? "Sent ✓" : "Send Message"}
                  <Send size={17} />
                </button>

                <p className="text-sm text-gray-500">
                  Or email us directly at{" "}
                  <a className="text-teal-600 font-medium" href="mailto:support@curewrapplus.com">
                    support@curewrapplus.com
                  </a>
                </p>
              </div>
            </motion.form>

            {/* COLLAGE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4 h-full min-h-[650px]"
            >
              <img src={CoupleExer_Outdoor} className="rounded-xl shadow-lg object-cover w-full h-full hover:scale-105 transition duration-500" />
              <img src={unsplashYoga} className="rounded-xl shadow-lg object-cover w-full h-full hover:scale-105 transition duration-500" />
              <img src={oldJogging} className="rounded-xl shadow-lg object-cover w-full h-full col-span-2 hover:scale-105 transition duration-500" />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}