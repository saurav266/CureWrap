// src/pages/NotFound.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const [countdown, setCountdown] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, autoRedirect]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // 🔍 send user to product page with search query
    navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCancelRedirect = () => {
    setAutoRedirect(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      {/* subtle radial background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-10 sm:px-10 shadow-2xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-gray-200 mb-5">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          Page not found
        </div>

        {/* 404 big text */}
        <div className="flex items-baseline gap-3">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-6xl sm:text-7xl font-extrabold tracking-tight"
          >
            404
          </motion.h1>
          <p className="text-sm text-gray-300">
            The route you requested doesn&apos;t exist.
          </p>
        </div>

        {/* URL info */}
        <p className="mt-3 text-sm text-gray-300 break-all">
          Requested URL:{" "}
          <span className="font-mono text-gray-100">
            {location.pathname || "/"}
          </span>
        </p>

        {/* Message */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg mt-4 text-gray-100"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </motion.p>

        {/* Countdown */}
        {autoRedirect ? (
          <motion.span
            key={countdown}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm mt-3 text-gray-300 block"
          >
            Redirecting to{" "}
            <span className="font-semibold text-white">Home</span> in{" "}
            <span className="font-semibold">{countdown}</span> seconds...
          </motion.span>
        ) : (
          <p className="text-sm mt-3 text-gray-300">
            Auto-redirect cancelled. You can use the options below.
          </p>
        )}

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-7 w-full flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Search products instead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-blue-400/80 border border-gray-200/60 bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition text-sm sm:text-base"
          >
            Search
          </button>
        </form>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-7">
          <button
            onClick={handleGoBack}
            className="px-4 sm:px-5 py-2 rounded-xl border border-white/25 text-white/90 hover:bg-white/10 text-sm sm:text-base transition"
          >
            Go Back
          </button>

          <Link
            to="/"
            className="px-4 sm:px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm sm:text-base transition"
          >
            Go Home Now
          </Link>

          {autoRedirect && (
            <button
              onClick={handleCancelRedirect}
              className="px-4 sm:px-5 py-2 rounded-xl bg-transparent border border-red-400/70 text-red-300 hover:bg-red-500/10 text-sm sm:text-base transition"
            >
              Cancel Auto-Redirect
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
