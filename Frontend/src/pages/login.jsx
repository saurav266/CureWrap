import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginWithMobile = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:8000"; // Adjust as needed
  // ↓↓↓ New format function — EXACT MATCH for backend DB format
  const formatMobile = (num) => {
    if (!num) return "";

    let cleaned = num.replace(/\D/g, ""); // keep only digits

    // If already starts with 91 and is 12 digits → return +91XXXXXXXXXX
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return `+${cleaned}`;
    }

    // If standard 10-digit → convert to +91XXXXXXXXXX
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }

    // fallback (rare)
    return `+91${cleaned}`;
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // -----------------------
  // REQUEST OTP
  // -----------------------
  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formatted = formatMobile(mobile);

      await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { phoneno: formatted },
        { withCredentials: true }
      );

      setStep("verify");
      setCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // VERIFY OTP
  // -----------------------
  const verifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const formatted = formatMobile(mobile);

    const response = await axios.post(
      `${BACKEND_URL}/api/users/verify-otp`,
      { phoneno: formatted, otp },
      { withCredentials: true }
    );

    const { user, token } = response.data;

    // Always choose correct ID
    const userId = user.id || user._id;

    // SAVE EVERYTHING
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", userId);

    // Update Auth Context
    login(user, token);

    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-6">
          Login with Mobile
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === "request" ? (
          <form onSubmit={requestOtp}>
            <label className="block mb-2">Mobile Number:</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter your mobile"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label className="block mb-2">Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={requestOtp}
              disabled={cooldown > 0}
              className="w-full mt-3 py-2 bg-yellow-500 text-white rounded-md disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginWithMobile;
