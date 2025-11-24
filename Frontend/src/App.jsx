import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";

import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Product from "./pages/product.jsx";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/Dashboard";
import AdminProducts from "./components/admin/Products";
import AdminAddProduct from "./components/admin/AddProduct";
import AdminCategories from "./components/admin/Categories";
import AdminUsers from "./components/admin/Users";
import AdminSettings from "./components/admin/Settings";

function App() {
  return (
    <Routes>

      {/* PUBLIC WEBSITE ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN DASHBOARD ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="add-product" element={<AdminAddProduct />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

    </Routes>
  );
}

export default App;
