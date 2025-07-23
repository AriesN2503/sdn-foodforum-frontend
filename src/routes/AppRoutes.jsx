import { Routes, Route } from "react-router"
import MainLayout from "../layout/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import Home from "../pages/Home"
import PostDetail from "../pages/PostDetail"
import CreatePost from "../pages/CreatePost"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ModeratorDashboard from "../pages/ModeratorDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import { UserProfile } from "../pages/UserProfile"
import UserPosts from "../pages/UserPosts"
import Chat from "../pages/Chat"
import NotFound from "../pages/NotFound"
import AdminLogin from "../pages/AdminLogin"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="my-posts" element={
          <ProtectedRoute>
            <UserPosts />
          </ProtectedRoute>
        } />
      </Route>
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
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path='profile'
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      {/* Route my-posts đã được di chuyển vào MainLayout */}
      <Route
        path="chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path='admin/login' element={<AdminLogin />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
