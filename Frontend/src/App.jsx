import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/user/Navbar.jsx";
import Footer from "./components/Footer";

import Home from "./pages/home.jsx";
import Product from "./pages/product.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import AdminDashboard from "./components/admin/AdminDashBoard.jsx";
import ProtectedRoute from "./components/protected/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { user } = useAuth();

  // ✅ If logged in as admin → show only AdminDashboard
  if (user?.email === "saurav@example.com") {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminEmail="saurav@example.com">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  // ✅ Otherwise → normal user layout
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;