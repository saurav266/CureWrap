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
import ProductViewPage from "./pages/ViewPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Admin Pages
import AdminHome from "./pages/AdminPages/Home.jsx";
import OrderManagement from "./pages/AdminPages/Order.jsx";
import ProductManagement from "./pages/AdminPages/Product.jsx";
import UserManagement from "./pages/AdminPages/User.jsx";
import AdminNavbar from "./components/admin/AdminNavbar.jsx";

function App() {
  const { user } = useAuth();

  // SECURITY: Only THIS email can access admin panel
  const ADMIN_EMAIL = "saurav@example.com";

  // If logged in as admin → render admin routes ONLY
  if (user?.email === ADMIN_EMAIL) {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminEmail={ADMIN_EMAIL}>
              <AdminNavbar />
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminEmail={ADMIN_EMAIL}>
              <AdminNavbar />
              <OrderManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminEmail={ADMIN_EMAIL}>
              <AdminNavbar />
              <ProductManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminEmail={ADMIN_EMAIL}>
              <AdminNavbar />
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  // Regular users → normal website
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
