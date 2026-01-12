// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminEmail }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation(); // 👈 capture current route

  // 🔐 Not logged in → redirect to login with return path
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // 👈 save page user wanted
      />
    );
  }

  // 🔒 Admin-only route check
  if (adminEmail && user?.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
