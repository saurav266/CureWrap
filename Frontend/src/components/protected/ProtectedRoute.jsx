// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminEmail }) => {
  const { isAuthenticated, user } = useAuth();

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If adminEmail is passed → check against user.email
  if (adminEmail && user?.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;