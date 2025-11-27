import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { useLocation } from "react-router-dom";
import Navbar from "./components/user/Navbar.jsx";
import Footer from "./components/Footer";

import Home from "./pages/Homeuser.jsx";
import Product from "./pages/Product.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from "./components/protected/ProtectedRoute.jsx";
import ProductViewPage from "./pages/ViewPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Admin Pages
import AdminHome from "./pages/AdminPages/Home.jsx";

import AdminProductPage from "./components/admin/Product.jsx";
import EditProductPage from "./components/admin/EditProduct.jsx";
import AddProductPage from "./components/admin/AddProduct.jsx";
import UserManagement from "./pages/AdminPages/User.jsx";
import AdminNavbar from "./components/admin/AdminNavbar.jsx";
// for order
import AllOrder from "./components/admin/order/AllOrder.jsx";

// Checkouts
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderPlaced from "./pages/OrderPlaced";
import CartDrawer from "./components/CartDrawer";
import { useState, useEffect } from "react";

// Track order
import OrderTrackingPage from "./pages/OrderTrackingPage";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCartOpen(true);
    window.addEventListener("openCart", handleOpen);
    return () => window.removeEventListener("openCart", handleOpen);
  }, []);

  const { user } = useAuth();
  const ADMIN_EMAIL = "saurav@example.com";
  const location = useLocation();
  const hideFooterOn = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/checkout/payment",
    "/checkout/success",
    "/orders/:id",
    "/orders",
  ];
  const shouldHideFooter = hideFooterOn.includes(location.pathname);

  // Admin routes
 // Admin routes
// Admin routes
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
            <AllOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminEmail={ADMIN_EMAIL}>
            <AdminNavbar />
            <AdminProductPage />
          </ProtectedRoute>
        }
      />

      {/* ADD PRODUCT ROUTE */}
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute adminEmail={ADMIN_EMAIL}>
            <AdminNavbar />
            <AddProductPage />
          </ProtectedRoute>
        }
      />

      {/* Edit Product */}
      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute adminEmail={ADMIN_EMAIL}>
            <AdminNavbar />
            <EditProductPage />
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



  // Regular users
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/checkout/success" element={<OrderPlaced />} />
        <Route path="/orders/:id" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
