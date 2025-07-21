import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import {
    Users,
    BookOpen,
    MessageSquare,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    Settings,
    Bell,
    ChefHat,
    Coffee,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { deleteUser, getUsers, updateUser, updateUserStatus } from "../api/user"
import PostManagement from "../components/admin/PostManagement"
import { useToast } from "../context/ToastContext"
import UserManagement from "../components/admin/UserManagement";
import { getPosts } from "../api/post";
import Dashboard from "../components/admin/Dashboard";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [deletingUser, setDeletingUser] = useState(null);
    const { showToast } = useToast()

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
        { id: "users", label: "Users", icon: Users },
        // { id: "recipes", label: "Recipes", icon: BookOpen },
        { id: "posts", label: "Posts", icon: MessageSquare },
        // { id: "settings", label: "Settings", icon: Settings },
    ]

    // Dashboard Data
    const stats = [
        { title: "Total Users", value: users.length, change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Posts", value: posts.length, change: "+15%", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Active Users", value: "892", change: "+5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getUsers()
                setUsers(res)
            } catch (err) {
                console.error("Failed to fetch users", err)
            }
        }
        const fetchPostData = async () => {
            try {
                const res = await getPosts()
                setPosts(res.data || res)
            } catch (err) {
                console.error("Failed to fetch posts", err)
            }
        }
        fetchUserData()
        fetchPostData()
    }, [])

    // After fetching users and posts, compute the latest user and post
    const latestUser = users.length > 0 ? [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;
    const latestPost = posts.length > 0 ? [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;


    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser._id);
            setUsers((prev) => prev.filter(u => u._id !== deletingUser._id));
            showToast("User deleted successfully!", { type: "success" });
        } catch (err) {
            console.error("Failed to delete user:", err);
            showToast("Failed to delete user.", { type: "error" });
        } finally {
            setDeletingUser(null);
        }
    };


    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            const updatedUserData = {
                username: editingUser.username,
                email: editingUser.email,
                role: editingUser.role,
            };

            const updated = await updateUser(editingUser._id, updatedUserData);
            setUsers(prev =>
                prev.map(user => (user._id === updated._id ? updated : user))
            );
            setEditingUser(null);
            showToast("User updated successfully!", { type: "success" });
        } catch (err) {
            console.error("Failed to update user:", err);
            if (err?.response?.data?.error?.includes("duplicate key error")) {
                showToast("Email already exists. Please use a different one.", { type: "error" });
            } else {
                showToast("Failed to update user.", { type: "error" });
            }
        }
    };

    const handleChangeUserStatus = async (userId, newStatus) => {
        try {
            const res = await updateUserStatus(userId, newStatus);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
            showToast(res.message || "User status updated", { type: "success" });
        } catch (err) {
            showToast(err?.response?.data?.error || err.message || "Failed to update status", { type: "error" });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "banned":
                return <Badge className="bg-red-100 text-red-800">Banned</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }


    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard stats={stats} latestUser={latestUser} latestPost={latestPost} />;
            case "users":
                return <UserManagement />;
            case "posts":
                return <PostManagement />;
            // case "recipes":
            //     return renderRecipes()
            case "settings":
                return renderSettings()
            default:
                return renderDashboard()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-orange-500">
                                <ChefHat className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-orange-500">FoodForum Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                3
                            </span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-orange-100 text-orange-600">AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {/* <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex cursor-pointer items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-6">
                {renderContent()}
            </main>
        </div>
    )
}