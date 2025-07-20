import { Routes, Route, Navigate } from "react-router"
import MainLayout from "../layout/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import { useAuth } from "../hooks/useAuth"
import Home from "../pages/Home"
import PostDetail from "../pages/PostDetail"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ModeratorDashboard from "../pages/ModeratorDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import { UserProfile } from "../pages/UserProfile"
import Chat from "../pages/Chat"
import NotFound from "../pages/NotFound"
import AdminLogin from "../pages/AdminLogin"
import CreatePost from "../pages/CreatePost"

// Route chỉ cho phép truy cập khi chưa đăng nhập
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
      </Route>
      <Route path="post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
      <Route path="post/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route
        path="moderator"
        element={
          <ProtectedRoute requiredRole="moderator">
            <ModeratorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path='profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route
        path="chat"
        element={
          <ProtectedRoute><Chat /></ProtectedRoute>
        }
      />
      <Route path='admin/login' element={<AdminLogin />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
