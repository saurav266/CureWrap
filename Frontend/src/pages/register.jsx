import axios from "axios";
import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); // register → otp
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Step 1: Register user and request OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/users/register", {
        name,
        email,
        phone,
      });
      setStep("otp"); // move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/verify-otp",
        { phone, otp },
        { withCredentials: true }
      );
      console.log("Registration + OTP verified:", response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-700"></h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === "register" ? (
          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Register & Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            {/* OTP */}
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 mb-2">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Verify OTP
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