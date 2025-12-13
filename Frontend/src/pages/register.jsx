import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { login } = useAuth(); // ✅ get login() from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ----------------------
  // STEP 1: Register user
  // ----------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/register", {
  name,
  email,
  phoneno: phoneno.replace(/\D/g, "").slice(-10),  // <-- FIX HERE
});;

      setStep("otp");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // ---------------------
  // STEP 2: Verify OTP + AUTO LOGIN
  // ----------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
  "/api/users/verify-otp",
  { 
    phoneno: phoneno.replace(/\D/g, "").slice(-10), // <-- FIX HERE
    otp 
  }
);

      console.log("Verify Response:", response.data);

   if (response.data.success) {
    const userData = response.data.user;
    const tokenValue = response.data.token;

    // FIXED userId saving
    const userId = userData.id || userData._id;
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", tokenValue);

    login(userData, tokenValue);

    navigate("/");
}

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "OTP Verification failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Step 1: Registration Form */}
        {step === "register" ? (
          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border bg-gray-50 rounded-md"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border bg-gray-50 rounded-md"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number:</label>
              <input
                type="tel"
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
                required
                className="w-full px-4 py-2 border bg-gray-50 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Register & Send OTP
            </button>
          </form>
        ) : (
          // Step 2: OTP Input
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border bg-gray-50 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Verify OTP & Login
            </button>
          </form>
        )}

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
