import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import PostManagement from "../components/admin/PostManagement"
import UserManagement from "../components/admin/UserManagement";
import Dashboard from "../components/admin/Dashboard";
import { useOutletContext } from "react-router";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const tabContext = useOutletContext();
    const tab = tabContext?.tab || "dashboard";
    // Xoá setUsers, setPosts, showToast, latestUser, latestPost nếu không dùng
    const stats = [
        { title: "Total Users", value: 0, change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Posts", value: 0, change: "+15%", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Active Users", value: "892", change: "+5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // const res = await getUsers() // This line was removed as per the edit hint
                // setUsers(res)
            } catch (err) {
                console.error("Failed to fetch users", err)
            }
        }
        const fetchPostData = async () => {
            try {
                // const res = await getPosts() // This line was removed as per the edit hint
                // setPosts(res.data || res)
            } catch (err) {
                console.error("Failed to fetch posts", err)
            }
        }
        fetchUserData()
        fetchPostData()
    }, [])

    // After fetching users and posts, compute the latest user and post
    // const latestUser = users.length > 0 ? [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;
    // const latestPost = posts.length > 0 ? [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;


    const renderContent = () => {
        switch (tab) {
            case "users":
                return <UserManagement />;
            case "posts":
                return <PostManagement />;
            default:
                return <UserManagement />;
        }
    }

    return (
        <div className="">
            {renderContent()}
        </div>
    );
}






