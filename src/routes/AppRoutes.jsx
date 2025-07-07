import { Routes, Route } from "react-router"
import MainLayout from "../layout/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import Home from "../pages/Home"
import PostDetail from "../pages/PostDetail"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ModeratorDashboard from "../pages/ModeratorDashboard"
import AdminDashboard from "../pages/AdminDashboard"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<PostDetail />} />

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

      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  )
}

export default AppRoutes
