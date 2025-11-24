import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login
    login({ email });

    alert("Logged in!");
  };

  return (
    <div>
      <h1>Login Page</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mt-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white px-4 py-2 mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
