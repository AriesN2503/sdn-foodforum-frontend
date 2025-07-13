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
import { deleteUser, getUsers, updateUser } from "../api/user"
import { useToast } from "../context/ToastContext"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [deletingUser, setDeletingUser] = useState(null);
    const { showToast } = useToast()

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
        { id: "users", label: "Users", icon: Users },
        // { id: "recipes", label: "Recipes", icon: BookOpen },
        { id: "posts", label: "Posts", icon: MessageSquare },
        { id: "settings", label: "Settings", icon: Settings },
    ]

    // Dashboard Data
    const stats = [
        { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        // { title: "Total Recipes", value: "1,234", change: "+8%", icon: BookOpen, color: "text-green-600", bg: "bg-green-100" },
        { title: "Total Posts", value: "5,678", change: "+15%", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Active Users", value: "892", change: "+5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getUsers()
                console.log(res)
                setUsers(res)
            } catch (err) {
                console.error("Failed to fetch users", err)
            }
        }

        fetchUserData()
    }, [])


    const handleDeleteUser = async () => {
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




    // Recipes Data
    // const recipes = [
    //     { id: 1, title: "Spicy Korean Ramen", author: "Mike Chen", category: "Asian", status: "approved", likes: 45, createdAt: "2024-01-10" },
    //     { id: 2, title: "Vegan Chocolate Cake", author: "Emma Wilson", category: "Desserts", status: "pending", likes: 12, createdAt: "2024-01-09" },
    //     { id: 3, title: "Mediterranean Pasta", author: "Alex Thompson", category: "Italian", status: "approved", likes: 67, createdAt: "2024-01-08" },
    //     { id: 4, title: "Thai Green Curry", author: "Sarah Johnson", category: "Thai", status: "rejected", likes: 23, createdAt: "2024-01-07" },
    //     { id: 5, title: "Classic Beef Burger", author: "David Kim", category: "American", status: "approved", likes: 89, createdAt: "2024-01-06" },
    // ]

    // Posts Data
    const posts = [
        { id: 1, title: "Best cooking tips for beginners", author: "Sarah Johnson", category: "Tips", comments: 12, likes: 34, createdAt: "2024-01-10" },
        { id: 2, title: "Kitchen equipment recommendations", author: "Mike Chen", category: "Equipment", comments: 8, likes: 23, createdAt: "2024-01-09" },
        { id: 3, title: "Meal prep strategies", author: "Emma Wilson", category: "Planning", comments: 15, likes: 45, createdAt: "2024-01-08" },
        { id: 4, title: "Seasonal ingredient guide", author: "Alex Thompson", category: "Ingredients", comments: 6, likes: 18, createdAt: "2024-01-07" },
    ]

    const getStatusBadge = (isOnline) => {
        switch (isOnline) {
            case "active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "inactive":
                return <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "banned":
                return <Badge className="bg-red-100 text-red-800">Banned</Badge>
            case true:
                return <Badge className="bg-green-100 text-green-800">Online</Badge>
            case false:
                return <Badge className="bg-gray-100 text-gray-600">Offline</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }


    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                                    </div>
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-3 rounded-lg border">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">New user registered</p>
                                <p className="text-sm text-gray-500">Alex Thompson joined the platform</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                        </div>
                        {/* <div className="flex items-center space-x-4 p-3 rounded-lg border">
                            <div className="bg-green-100 p-2 rounded-full">
                                <BookOpen className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">Recipe approved</p>
                                <p className="text-sm text-gray-500">Spicy Korean Ramen by Mike Chen</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
                        </div> */}
                        <div className="flex items-center space-x-4 p-3 rounded-lg border">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium">New post created</p>
                                <p className="text-sm text-gray-500">Best cooking tips for beginners</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-auto">6 hours ago</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users Management</h2>
                <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <div className="flex space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button> */}
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-3">
                                                    <AvatarFallback className="bg-orange-100 text-orange-600">
                                                        {user.username?.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user.isOnline)}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {/* <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem> */}
                                                    <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setDeletingUser(user)}>
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold">Edit User</h2>
                        <div>
                            <label className="block text-sm mb-1">Username</label>
                            <Input
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <Input
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Role</label>
                            <select
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveEdit}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
            {deletingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
                        <p>Are you sure you want to delete user <strong>{deletingUser.username}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDeletingUser(null)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleDeleteUser}
                            >
                                Confirm Delete
                            </Button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )


    // const renderRecipes = () => (
    //     <div className="space-y-6">
    //         <div className="flex justify-between items-center">
    //             <h2 className="text-2xl font-bold">Recipes Management</h2>
    //             <Button className="bg-orange-500 hover:bg-orange-600">
    //                 <Plus className="h-4 w-4 mr-2" />
    //                 Add Recipe
    //             </Button>
    //         </div>

    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //             {recipes.map((recipe) => (
    //                 <Card key={recipe.id}>
    //                     <CardContent className="p-4">
    //                         <div className="flex justify-between items-start mb-3">
    //                             <Badge variant="outline">{recipe.category}</Badge>
    //                             {getStatusBadge(recipe.status)}
    //                         </div>
    //                         <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
    //                         <p className="text-sm text-gray-600 mb-3">by {recipe.author}</p>
    //                         <div className="flex justify-between items-center text-sm text-gray-500">
    //                             <span>{recipe.likes} likes</span>
    //                             <span>{recipe.createdAt}</span>
    //                         </div>
    //                         <div className="flex space-x-2 mt-4">
    //                             <Button size="sm" variant="outline" className="flex-1">
    //                                 <Eye className="h-4 w-4 mr-1" />
    //                                 View
    //                             </Button>
    //                             <Button size="sm" variant="outline" className="flex-1">
    //                                 <Edit className="h-4 w-4 mr-1" />
    //                                 Edit
    //                             </Button>
    //                         </div>
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //         </div>
    //     </div>
    // )

    const renderPosts = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Posts Management</h2>
                <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                </Button>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Badge variant="outline">{post.category}</Badge>
                                        <span className="text-sm text-gray-500">{post.createdAt}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">by {post.author}</p>
                                    <div className="flex space-x-4 text-sm text-gray-500">
                                        <span>{post.likes} likes</span>
                                        <span>{post.comments} comments</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                        <DropdownMenuItem><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )

    const renderSettings = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Site Name</label>
                            <Input defaultValue="FoodForum" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Site Description</label>
                            <Textarea defaultValue="A community for food enthusiasts to share recipes and cooking tips." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Email</label>
                            <Input defaultValue="admin@foodforum.com" />
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Moderation Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Auto-approve new recipes</span>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Auto-approve new posts</span>
                            <Button variant="outline" size="sm">Disable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Email notifications</span>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 w-full">Update Settings</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return renderDashboard()
            case "users":
                return renderUsers()
            // case "recipes":
            //     return renderRecipes()
            case "posts":
                return renderPosts()
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
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
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
                                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
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