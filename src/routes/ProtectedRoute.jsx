"use client"

import { Navigate, useLocation } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { checkRole } from "../utils/auth"


const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Đang kiểm tra đăng nhập...</div>;

    // Xác định đã đăng nhập hay chưa
    const isAuthenticated = !!user;

    // Kiểm tra nếu là route admin
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (!isAuthenticated) {
        if (isAdminRoute) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !checkRole(user.role, requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
