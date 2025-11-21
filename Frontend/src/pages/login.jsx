import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ add Link
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ import your AuthContext

const LoginWithMobile = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // request or verify
  const [error, setError] = useState("");
  const { login } = useAuth(); // ✅ get login from context
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users/request-otp", { mobile });
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/verify-otp",
        { mobile, otp },
        { withCredentials: true }
      );

      const { user, token } = response.data;

      // ✅ Call AuthContext login to persist user + token
      login(user, token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
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
            />
            <button type="submit" className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md">
              Send OTP
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
            <button type="submit" className="w-full mt-4 py-2 bg-green-500 text-white rounded-md">
              Verify & Login
            </button>
          </form>
        )}

        {/* ✅ Add "Don't have an account?" */}
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