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

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always visible */}
      <Navbar />

      {/* Main content area */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {/* Footer + Features always visible */}
      <Footer />
    </div>
  );
}

export default App;