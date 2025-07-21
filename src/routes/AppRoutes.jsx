import { Routes, Route } from "react-router"
import ProtectedRoute from "./ProtectedRoute"
import { useAuth } from "../hooks/useAuth"
import Home from "../pages/Home"
import AllPosts from "../pages/AllPosts"
import PostDetail from "../pages/PostDetail"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ModeratorDashboard from "../pages/ModeratorDashboard"
import AdminDashboard from "../pages/AdminDashboard"
import UserProfile from "../pages/UserProfile"
import Chat from "../pages/Chat"
import NotFound from "../pages/NotFound"
import AdminLogin from "../pages/AdminLogin"
import { MainLayout, HeaderLayout } from "../layout"

const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
            </Route>

            <Route path="/posts" element={<HeaderLayout />}>
                <Route path="all" element={<AllPosts />} />
                <Route
                    path="new"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />
                <Route path=":slug" element={<PostDetail />} />
                {/* <Route path=":id" element={<PostDetail />} /> */}
                {/* <Route path=":id/edit" element={<CreatePost />} /> */}
            </Route>



            <Route path="post/:id" element={<PostDetail />} />
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

            <Route path="/profile" element={<HeaderLayout />}>
                <Route
                    path=":username"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route path=":slug" element={<PostDetail />} />
                {/* <Route path=":id" element={<PostDetail />} /> */}
                {/* <Route path=":id/edit" element={<CreatePost />} /> */}
            </Route>

            <Route
                path="chat"
                element={
                    <Chat />
                }
            />
            <Route path='admin/login' element={<AdminLogin />} />

            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
