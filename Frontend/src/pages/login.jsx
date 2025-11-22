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

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Helper to format number with +91
  const formatMobile = (num) => {
    if (!num) return "";
    return num.startsWith("+91") ? num : `+91${num.replace(/^(\+91)?/, "")}`;
  };

  const requestOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const formattedMobile = formatMobile(mobile);

      await axios.post(
        "http://localhost:8000/api/users/login",
        { phoneNumber: formattedMobile },
        { withCredentials: true }
      );

      setStep("verify");
      setError("");
      setCooldown(30); // 30s cooldown
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedMobile = formatMobile(mobile);

      const response = await axios.post(
        "http://localhost:8000/api/users/verify-otp",
        { phoneNumber: formattedMobile, otp },
        { withCredentials: true }
      );

      const { user } = response.data;
      login(user); // cookie is already stored by browser
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
        <h2 className="text-xl font-semibold text-center mb-6">Login with Mobile</h2>
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
              placeholder="Enter 10-digit number"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
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

            {/* Resend OTP with cooldown */}
            <button
              type="button"
              onClick={requestOtp}
              disabled={loading || cooldown > 0}
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