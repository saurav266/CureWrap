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

import ProtectedRoute from "./components/protected/ProtectedRoute.jsx";


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
         
          element={
            <ProtectedRoute>
              
            </ProtectedRoute>
          }
        />

        {/* Admin route (specific email check) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminEmail="admin@example.com">
              
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;