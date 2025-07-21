"use client"

import { Navigate, useLocation } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { checkRole } from "../utils/auth"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  // Xác định đã đăng nhập hay chưa
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !checkRole(user.role, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
