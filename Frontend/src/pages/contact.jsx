// ContactUsPremium.jsx
import React, { useState } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Send, MessageCircle, MapPin, Mail } from "lucide-react";

import CoupleExer_Outdoor from "../assets/Frontend_assets/contact/CoupleExer_Outdoor.png";
import unsplashYoga2 from "../assets/Frontend_assets/contact/unsplash_Yoga2.jpg";
import unsplashYoga from "../assets/Frontend_assets/contact/unsplash_Yoga.jpg";
import oldJogging from "../assets/Frontend_assets/contact/old_jogging.png";
import { assets } from "../assets/admin_assets/assets.js";
// uploaded logo (developer-provided local path)
const logoUrl = assets.logo;
import contact from "../assets/Frontend_assets/contact/contact.jpg";
// brand colors (from your logo)
const brandBlue = "#2F86D6";
const brandGreen = "#63B46B";

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

  // parallax small translate on scroll
  const { scrollYProgress } = useViewportScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // simulate API
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 2800);
    }, 1100);
  };

  return (
    <div className="antialiased text-gray-800 bg-white">

      {/* ================= HERO (PARALLAX) ================= */}
      <section className="relative w-full h-[66vh] md:h-[78vh] lg:h-[86vh] overflow-hidden">
        <motion.img
          src={contact}
          style={{ y }}
          initial={{ scale: 1.02, opacity: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />

        {/* light overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/3 to-transparent" />

        {/* floating badges (left) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="absolute left-6 top-10 md:left-16 md:top-20 flex flex-col gap-5 z-30"
        >
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg flex items-center gap-3 w-56">
            <MessageCircle className="w-6 h-6 text-teal-600" />
            <div>
              <div className="text-xs text-gray-600">Customer Care</div>
              <div className="font-semibold text-gray-900">Chat 24/7</div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg flex items-center gap-3 w-56">
            <MapPin className="w-6 h-6 text-emerald-500" />
            <div>
              <div className="text-xs text-gray-600">Visit</div>
              <div className="font-semibold text-gray-900">405 Science Dr</div>
            </div>
          </div>
        </motion.div>

        {/* centered brand + title */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="flex items-center gap-5 bg-white/8 backdrop-blur-md px-6 py-4 rounded-full shadow-sm"
            style={{ pointerEvents: "none" }}
          >
            <img src={logoUrl} alt="logo" className="h-25 w-auto object-contain" />

            <div className="flex flex-col items-start -ml-1">
              <motion.h1
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-white text-3xl md:text-4xl font-semibold tracking-tight"
                style={{ textShadow: "0 6px 24px rgba(0,0,0,0.25)" }}
              >
                Contact
                <span className="ml-2" />
                <span style={{ color: brandBlue }}>Cure</span>
                <span style={{ color: brandGreen }} className="ml-1">Wrap</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-xs text-white/90 mt-1"
              >
                We're ready to help — ask us anything.
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* curved SVG bottom wave */}
        <div className="absolute left-0 right-0 bottom-0">
          <svg viewBox="0 0 1440 120" className="w-full h-[120px]" preserveAspectRatio="none">
            <path d="M0,40 C200,120 400,0 720,24 C1040,48 1240,120 1440,80 L1440 120 L0 120 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 -mt-10">

        {/* intro */}
        <section className="bg-white py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                We're Here to Help
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you need product guidance, help with an order, or want to share your CureWrap story, our team is here for you. Fill out the form and we’ll respond as soon as possible.
              </p>
            </div>

            {/* contact small cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  type: "chat",
                  title: "Chat with Us",
                  desc: "+1 (805) 517-4839",
                  icon: <MessageCircle className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-br from-[#2F86D6] to-[#63B46B]"
                },
                {
                  type: "location",
                  title: "Visit",
                  desc: "405 Science Dr, CA",
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-br from-[#14B8A6] to-[#06B6D4]"
                },
                {
                  type: "email",
                  title: "Email",
                  desc: "support@curewrap.com",
                  icon: <Mail className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-br from-[#F97316] to-[#F43F5E]"
                },
              ].map((c) => (
                <motion.div
                  key={c.type}
                  onMouseEnter={() => setHoveredCard(c.type)}
                  onMouseLeave={() => setHoveredCard(null)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transform transition-all duration-300 ${
                    hoveredCard === c.type ? "scale-105 shadow-2xl" : ""
                  }`}
                >
                  <div className={`rounded-xl px-3 py-2 inline-flex items-center justify-center ${c.bg}`}>
                    {c.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* soft divider wave */}
        <div className="w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-[80px]" preserveAspectRatio="none">
            <path d="M0,24 C300,120 600,0 720,24 C840,48 1140,0 1440,24 L1440 80 L0 80 Z" fill="#fbfdff" />
          </svg>
        </div>

        {/* form + right images collage */}
        <section className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-strech">
            {/* FORM */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 h-full min-h-[650px]"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tell us more</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">First name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("firstName")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                      focusedInput === "firstName" ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_30px_rgba(47,134,214,0.08)]" : "border-gray-200"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Last name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("lastName")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                      focusedInput === "lastName" ? "border-[rgba(99,180,107,0.85)] shadow-[0_8px_30px_rgba(99,180,107,0.06)]" : "border-gray-200"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-2 block">Email*</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                    focusedInput === "email" ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_30px_rgba(47,134,214,0.08)]" : "border-gray-200"
                  }`}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-2 block">Subject</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("subject")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border ${
                    focusedInput === "subject" ? "border-[rgba(99,180,107,0.85)] shadow-[0_8px_30px_rgba(99,180,107,0.06)]" : "border-gray-200"
                  }`}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-2 block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("message")}
                  onBlur={() => setFocusedInput(null)}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 border resize-none ${
                    focusedInput === "message" ? "border-[rgba(47,134,214,0.85)] shadow-[0_8px_30px_rgba(47,134,214,0.08)]" : "border-gray-200"
                  }`}
                />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-3 bg-gradient-to-r from-[#2F86D6] to-[#63B46B] px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:scale-[1.02] transition transform"
                  disabled={sending}
                >
                  {sending ? "Sending..." : sent ? "Sent ✓" : "Send Message"}
                  <Send size={16} />
                </button>

                <div className="text-sm text-gray-500">
                  Or reach us directly at <a className="text-teal-600 font-medium" href="mailto:support@curewrap.com">support@curewrap.com</a>
                </div>
              </div>
            </motion.form>

            {/* right collage images */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src={CoupleExer_Outdoor} alt="a" className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src={unsplashYoga} alt="b" className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg col-span-2">
                  <img src={oldJogging} alt="c" className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* small footer CTA */}
        <section className="py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h4 className="text-xl font-semibold mb-2">Prefer a live chat?</h4>
            <p className="text-gray-600 mb-4">Click the chat icon on the bottom-right and we’ll be with you in seconds.</p>
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2F86D6] to-[#63B46B] text-white font-semibold shadow hover:scale-[1.02] transition">Start Chat</button>
          </div>
        </section>
      </main>

    </div>
  );
}
