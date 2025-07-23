import {
    Bell,
    ChefHat,
    Edit,
    Eye,
    LogOut,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Trash2,
    TrendingUp,
    Users
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { register } from "../api/auth"
import postsApi from "../api/posts"
import { deleteUser, getUsers, updateUser } from "../api/user"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { useToast } from "../context/ToastContext"
import { useAuth } from "../hooks/useAuth"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [deletingUser, setDeletingUser] = useState(null)
    const [addingUser, setAddingUser] = useState(false)
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    })
    const [isLoading, setIsLoading] = useState(true)
    const [dashboardStats, setDashboardStats] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const { showToast } = useToast()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    // Check admin permission
    useEffect(() => {
        if (user && user.role !== 'admin') {
            showToast("Access denied: Admin privileges required", { type: "error" })
            navigate('/', { replace: true })
        }
    }, [user, showToast, navigate])

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
        { id: "users", label: "Users", icon: Users }
    ]

    // Fetch users and posts data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [usersResponse, postsResponse] = await Promise.all([
                    getUsers(),
                    postsApi.getAllPosts()
                ]);
                setUsers(usersResponse);
                setPosts(postsResponse);
            } catch (err) {
                console.error("Failed to fetch data", err);
                showToast("Failed to load data. Please try again.", { type: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [showToast]);

    // Update dashboard stats
    useEffect(() => {
        if (users.length > 0 || posts.length > 0) {
            setDashboardStats([
                { title: "Total Users", value: users.length, change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                { title: "Total Posts", value: posts.length, change: "+15%", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
                { title: "Active Users", value: users.filter(u => u.isOnline).length, change: "+5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
                { title: "Admin Users", value: users.filter(u => u.role === 'admin').length, change: "+0%", icon: Settings, color: "text-green-600", bg: "bg-green-100" },
            ]);
        }
    }, [users, posts]);

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
                return <Badge variant="outline">{isOnline}</Badge>
        }
    }

    const filteredUsers = users.filter((user) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add a delete post handler
    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await postsApi.deletePost(postId);
                setPosts(posts.filter(post => post._id !== postId));
                showToast("Post deleted successfully", { type: "success" });
            } catch (error) {
                console.error("Failed to delete post:", error);
                showToast("Failed to delete post", { type: "error" });
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Add a handler for adding a new user
    const handleAddUser = async () => {
        try {
            // Validate inputs
            if (!newUser.username || !newUser.email || !newUser.password) {
                showToast("Please fill in all required fields", { type: "error" });
                return;
            }

            // Register the new user
            const response = await register(newUser);

            // Add the new user to the users list
            setUsers(prev => [...prev, response.user]);

            // Reset the form and close the modal
            setNewUser({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            setAddingUser(false);

            showToast("User added successfully!", { type: "success" });
        } catch (err) {
            console.error("Failed to add user:", err);
            if (err?.response?.data?.error?.includes("duplicate key error")) {
                showToast("Email already exists. Please use a different one.", { type: "error" });
            } else {
                showToast("Failed to add user: " + (err.response?.data?.error || err.message), { type: "error" });
            }
        }
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => {
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
                    {isLoading ? (
                        <div className="flex justify-center p-4">Loading activities...</div>
                    ) : (
                        <div className="space-y-4">
                            {users.slice(0, 3).map((user) => (
                                <div key={user._id} className="flex items-center space-x-4 p-3 rounded-lg border">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">User registered</p>
                                        <p className="text-sm text-gray-500">{user.username} joined the platform</p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {posts.slice(0, 2).map((post) => (
                                <div key={post._id} className="flex items-center space-x-4 p-3 rounded-lg border">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <MessageSquare className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">New post created</p>
                                        <p className="text-sm text-gray-500">{post.title}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users Management</h2>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setAddingUser(true)}>
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
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center p-8">Loading users data...</div>
                    ) : (
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
                                                        <AvatarImage src={user.avatar} alt={user.username} />
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
                    )}
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
                                <option value="moderator">Moderator</option>
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

            {/* Add User Modal */}
            {addingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold">Add New User</h2>
                        <div>
                            <label className="block text-sm mb-1">Username</label>
                            <Input
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <Input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <Input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Enter password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Role</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                            >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setAddingUser(false)}>Cancel</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleAddUser}>Add User</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const renderPosts = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Posts Management</h2>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/create-post')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">Loading posts data...</div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post._id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Badge variant="outline">{post.category?.name || 'Uncategorized'}</Badge>
                                            <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">by {post.author?.username || 'Unknown'}</p>
                                        <div className="flex space-x-4 text-sm text-gray-500">
                                            <span>{post.votes?.length || 0} votes</span>
                                            <span>{post.comments?.length || 0} comments</span>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => navigate(`/posts/${post._id}`)}>
                                                <Eye className="h-4 w-4 mr-2" />View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/edit-post/${post._id}`)}>
                                                <Edit className="h-4 w-4 mr-2" />Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                                                <Trash2 className="h-4 w-4 mr-2" />Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return renderDashboard()
            case "users":
                return renderUsers()
            case "posts":
                return renderPosts()
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
                                        <AvatarImage src={user?.avatar} alt={user?.username} />
                                        <AvatarFallback className="bg-orange-100 text-orange-600">
                                            {user?.username?.slice(0, 2).toUpperCase() || 'AD'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem onClick={handleLogout}>
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
