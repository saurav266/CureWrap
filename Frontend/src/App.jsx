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
const Product = lazy(() => import("./pages/Product.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Login = lazy(() => import("./pages/login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const ProductViewPage = lazy(() => import("./pages/ViewPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage.jsx"));

// Lazy Loaded Admin Pages
const AdminNavbar = lazy(() => import("./components/admin/AdminNavbar.jsx"));
const AdminHome = lazy(() => import("./pages/AdminPages/Home.jsx"));
const AdminProductPage = lazy(() => import("./components/admin/Product.jsx"));
const EditProductPage = lazy(() => import("./components/admin/EditProduct.jsx"));
const AddProductPage = lazy(() => import("./components/admin/AddProduct.jsx"));
const UserManagement = lazy(() => import("./pages/AdminPages/User.jsx"));
const AllOrder = lazy(() => import("./components/admin/order/AllOrder.jsx"));
const EditOrderPage = lazy(() => import("./components/admin/order/OrderEditPage.jsx"));

// Memoized Wrappers
const MemoNavbar = React.memo(Navbar);
const MemoFooter = React.memo(Footer);
const MemoCartDrawer = React.memo(CartDrawer);

function App() {
  const { user } = useAuth();
  const ADMIN_EMAIL = "saurav@example.com";

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCartOpen(true);
    window.addEventListener("openCart", handleOpen);
    return () => window.removeEventListener("openCart", handleOpen);
  }, []);

  const location = useLocation();

  const hideFooterOn = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/checkout/payment",
    "/checkout/success"
  ];
  const shouldHideFooter = hideFooterOn.includes(location.pathname);

  // ===========================================
  // ADMIN ROUTES
  // ===========================================
  if (user?.email === ADMIN_EMAIL) {
    return (
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

          {/* redirect unknown admin path */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    );
  }

  // ===========================================
  // USER ROUTES
  // ===========================================
  return (
    <div className="min-h-screen flex flex-col">
      <MemoNavbar />
      <MemoCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protected customer pages */}
          <Route
            path="/orders"
            element={
              user ? <MyOrders /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/orders/:id"
            element={
              user ? <OrderTrackingPage /> : <Navigate to="/login" replace />
            }
          />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/checkout/success" element={<OrderPlaced />} />

          {/* fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!shouldHideFooter && <MemoFooter />}
    </div>
  );
}

export default App;
