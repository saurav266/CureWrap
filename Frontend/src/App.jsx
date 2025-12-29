// src/App.jsx
import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./index.css";

// Components
import Navbar from "./components/user/Navbar.jsx";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProtectedRoute from "./components/protected/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Lazy Loaded User Pages
const Home = lazy(() => import("./pages/Homeuser.jsx"));
const Product = lazy(() => import("./pages/product.jsx"));
const About = lazy(() => import("./pages/about.jsx"));
const Contact = lazy(() => import("./pages/contact.jsx"));
const Login = lazy(() => import("./pages/login.jsx"));
const Register = lazy(() => import("./pages/register.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const ProductViewPage = lazy(() => import("./pages/ViewPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage.jsx"));
import WishlistPage from "./components/user/wishlistPage.jsx";
import ProfilePage from "./components/user/ProfilePage.jsx";
// import ProductViewPage from "./pages/ProductViewpage.jsx";
// plicy page
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsOfService.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import FAQ from "./pages/FAQ.jsx";

// Lazy Loaded Admin Pages
const AdminNavbar = lazy(() => import("./components/admin/AdminNavbar.jsx"));
const AdminHome = lazy(() => import("./pages/AdminPages/Home.jsx"));
const AdminProductPage = lazy(() => import("./components/admin/Product.jsx"));
const EditProductPage = lazy(() => import("./components/admin/EditProduct.jsx"));
const AddProductPage = lazy(() => import("./components/admin/AddProduct.jsx"));
const AdminReturnPage = lazy(() => import("./components/admin/AdminReturnPage.jsx"));
const UserManagement = lazy(() => import("./components/admin/AllUser.jsx"));
const AllOrder = lazy(() => import("./components/admin/order/AllOrder.jsx"));
const EditOrderPage = lazy(() => import("./components/admin/order/OrderEditPage.jsx"));
import AdminUserDetails from "./components/admin/AdminUserDetails.jsx";

// ✅ Lazy Loaded NotFound Page
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Memoized Wrappers
const MemoNavbar = React.memo(Navbar);
const MemoFooter = React.memo(Footer);
const MemoCartDrawer = React.memo(CartDrawer);

import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  const { user, isAuthenticated, authReady } = useAuth();
  const ADMIN_EMAIL = "s.basanti1954@yahoo.com";

  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleOpen = () => setCartOpen(true);
    window.addEventListener("openCart", handleOpen);
    return () => window.removeEventListener("openCart", handleOpen);
  }, []);

  const hideFooterOn = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/checkout/payment",
    "/checkout/success",
    "/refund-policy",
    "/privacy-policy",
    "/terms",
    "/faq",
    "/product/:id",
    "/profile"
  ];
  const shouldHideFooter = hideFooterOn.includes(location.pathname);

  // Wait until auth is restored
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-t-4 border-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ===========================================
  // ADMIN ROUTES
  // ===========================================
  if (isAuthenticated && user?.email === ADMIN_EMAIL) {
    return (
      <>
      <ScrollToTop />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <AdminNavbar />
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <AllOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/returns"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <AdminReturnPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <EditOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <AdminProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id/details"
            element={
              <ProtectedRoute adminEmail={ADMIN_EMAIL /* or admin isAdmin logic */}>
                <AdminUserDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ Unknown admin routes → 404 */}
          <Route
            path="/"
            element={
              isAuthenticated && user?.email === ADMIN_EMAIL ? (
                <Navigate to="/admin" replace />
              ) : (
                <Home />
              )
            }
          />

        </Routes>
      </Suspense>
      </>
    );
  }

  // ===========================================
  // USER ROUTES
  // ===========================================
  return (
    <div className="min-h-screen flex flex-col">
      <MemoNavbar />
      <MemoCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ScrollToTop />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/faq" element={<FAQ />} />
         
          {/* Wishlist protected by isAuthenticated */}
          <Route
            path="/wishlist"
            element={
              isAuthenticated ? (
                <WishlistPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* protected customer pages */}
          <Route
            path="/orders"
            element={
              isAuthenticated ? <MyOrders /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/orders/:id"
            element={
              isAuthenticated ? (
                <OrderTrackingPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/checkout/success" element={<OrderPlaced />} />

          {/* ✅ Unknown user routes → 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!shouldHideFooter && <MemoFooter />}
    </div>
  );
}

export default App;
