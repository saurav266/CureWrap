import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/user/Navbar.jsx";


import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";

import ProductGrid from "./pages/Product.jsx";
import ProductsSection from "./components/productSection.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always visible */}
      <Navbar />

      {/* Main content area */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductGrid />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
         
        </Routes>
      </main>

      {/* Footer + Features always visible */}
     
      <ProductsSection />
      
    </div>
  );
}

export default App;