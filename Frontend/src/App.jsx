import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/user/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Framer from "./components/Framer.jsx";
import Features from "./components/Features.jsx";
import ShopActivity from "./components/ShopActivity.jsx";
import ImageShop from "./components/ImageShop.jsx";
import Prefooter from "./components/Prefooter.jsx";

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
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Fallback route */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>

        {/* Footer + Features always visible */}
        <Features />
        <Framer />
        <ShopActivity />
        <ImageShop />
        <Prefooter />
        <Footer />
      </div>
  );
}

export default App;