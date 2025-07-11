import { Routes, Route } from "react-router"
import MainLayout from "../layout/MainLayout"
import ProtectedRoute from "./ProtectedRoute"
import Home from "../pages/Home"
import PostDetail from "../pages/PostDetail"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ModeratorDashboard from "../pages/ModeratorDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import { UserProfile } from "../pages/UserProfile"
import Chat from "../pages/Chat"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Route>
      <Route
        path="moderator"
        element={
          // <ProtectedRoute requiredRole="moderator">
          //   <ModeratorDashboard />
          // </ProtectedRoute>
          <ModeratorDashboard />
        }
      />


      <Route
        path="admin"
        element={
          // <ProtectedRoute requiredRole="admin">
          //   <AdminDashboard />
          // </ProtectedRoute>
          <AdminDashboard />
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path='profile' element={<UserProfile />} />
      <Route 
        path="chat" 
        element={
        //   <ProtectedRoute requiredRole="user">
        //     <Chat />
        //   </ProtectedRoute>
          <Chat />
        } 
      />
    </Routes>
  )
}

export default AppRoutes
