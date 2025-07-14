import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import {
    Camera,
    Calendar,
    Save,
    Edit,
    Heart,
    MessageSquare,
    ThumbsUp,
    ChevronUp,
    ChevronDown,
    ArrowLeft,
} from "lucide-react"
import { getCurrentUser, updateUser, getUserFavoritePosts } from "../api/user"
import postsApi from "../api/posts"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router"
import { PostCard } from "../components/PostCard"

export function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [favoritePosts, setFavoritePosts] = useState([])
    const [activeTab, setActiveTab] = useState("profile")
    const { user: authUser, setUser, logout } = useAuth()
    const navigate = useNavigate()

    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        bio: "",
        phone_number: "",
        avatar: ""
    })

    // Load user data on component mount
    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            setLoading(true)
            
            // Get current user data
            const userResponse = await getCurrentUser()
            const user = userResponse.user
            
            setUserData(user)
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                phone_number: user.phone_number || "",
                avatar: user.avatar || ""
            })

            // Load user's posts
            if (user.id) {
                try {
                    const posts = await postsApi.getPostsByUser(user.id)
                    setUserPosts(Array.isArray(posts) ? posts : [])
                } catch (error) {
                    console.error('Error loading user posts:', error)
                    setUserPosts([])
                }
            }

            // Load favorite posts
            try {
                const favoritesResponse = await getUserFavoritePosts()
                setFavoritePosts(Array.isArray(favoritesResponse.posts) ? favoritesResponse.posts : [])
            } catch (error) {
                console.error('Error loading favorite posts:', error)
                setFavoritePosts([])
            }
            
        } catch (error) {
            console.error('Error loading user data:', error)
            setError('Failed to load user data')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            
            const updateData = {
                username: profileData.username,
                bio: profileData.bio,
                phone_number: profileData.phone_number
            }

            await updateUser(userData.id, updateData)
            
            // Update local state
            setUserData(prev => ({ ...prev, ...updateData }))
            setUser(prev => ({ ...prev, ...updateData }))
            
            setIsEditing(false)
            setError(null)
        } catch (error) {
            console.error('Error updating profile:', error)
            setError('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error && !userData) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={loadUserData}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Button>

            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={profileData.avatar} />
                                <AvatarFallback className="text-xl">
                                    {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <Button
                                    size="sm"
                                    className="absolute bottom-0 right-0 rounded-full p-2"
                                    variant="secondary"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    {isEditing ? (
                                        <Input
                                            value={profileData.username}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                            className="text-2xl font-bold mb-2"
                                            placeholder="Username"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-bold">{userData?.username}</h1>
                                    )}
                                    <p className="text-gray-600">{userData?.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm text-gray-500">
                                            Joined {formatDate(userData?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button 
                                                onClick={handleSave} 
                                                disabled={saving}
                                                className="bg-orange-500 hover:bg-orange-600"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {saving ? 'Saving...' : 'Save'}
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button 
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Bio</label>
                                {isEditing ? (
                                    <Textarea
                                        value={profileData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="text-gray-600 mt-1">
                                        {profileData.bio || "No bio available"}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">{userPosts.length}</div>
                                    <div className="text-sm text-gray-500">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">{favoritePosts.length}</div>
                                    <div className="text-sm text-gray-500">Favorites</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">
                                        {userPosts.reduce((total, post) => total + (post.votes || 0), 0)}
                                    </div>
                                    <div className="text-sm text-gray-500">Total Votes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                    <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                    <TabsTrigger value="posts" className="flex-1">My Posts ({userPosts.length})</TabsTrigger>
                    <TabsTrigger value="favorites" className="flex-1">Favorites ({favoritePosts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-gray-600">{userData?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Role</label>
                                <Badge variant="secondary" className="mt-1">
                                    {userData?.role || 'User'}
                                </Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Member Since</label>
                                <p className="mt-1 text-gray-600">{formatDate(userData?.createdAt)}</p>
                            </div>
                            {isEditing && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <Input
                                        value={profileData.phone_number}
                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                        placeholder="Your phone number"
                                        className="mt-1"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="posts" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userPosts.length > 0 ? (
                                <div className="space-y-6">
                                    {userPosts.map((post) => (
                                        <PostCard
                                            key={post._id || post.id}
                                            id={post._id || post.id}
                                            title={post.title}
                                            content={post.content}
                                            author={post.author?.username || 'Anonymous'}
                                            subreddit={post.category?.subreddit || 'r/general'}
                                            timestamp={new Date(post.createdAt).toLocaleDateString()}
                                            votes={post.votes || 0}
                                            commentCount={post.commentCount || 0}
                                            imageUrl={post.imageUrl}
                                            images={post.images || []}
                                            onCommentClick={() => navigate(`/post/${post._id || post.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No posts yet</p>
                                    <Button 
                                        className="mt-4 bg-orange-500 hover:bg-orange-600"
                                        onClick={() => navigate('/create-post')}
                                    >
                                        Create Your First Post
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="favorites" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {favoritePosts.length > 0 ? (
                                <div className="space-y-6">
                                    {favoritePosts.map((post) => (
                                        <PostCard
                                            key={post._id || post.id}
                                            id={post._id || post.id}
                                            title={post.title}
                                            content={post.content}
                                            author={post.author?.username || 'Anonymous'}
                                            subreddit={post.category?.subreddit || 'r/general'}
                                            timestamp={new Date(post.createdAt).toLocaleDateString()}
                                            votes={post.votes || 0}
                                            commentCount={post.commentCount || 0}
                                            imageUrl={post.imageUrl}
                                            images={post.images || []}
                                            onCommentClick={() => navigate(`/post/${post._id || post.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">No favorite posts yet</p>
                                    <p className="text-sm text-gray-400">
                                        Start exploring and heart the posts you love!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
                ...prev,
                id: user.id || user._id || prev.id, // ensure id is set!
                username: user.username || prev.username,
                email: user.email || prev.email,
                avatar: user.avatar || prev.avatar,
                phone_number: user.phone_number || prev.phone_number,
            }))
        })
    }, [])

    const handleSave = async () => {
        setSaving(true);
        try {
            const updateData = {
                username: profileData.username,
                phone_number: profileData.phone_number,
                avatar: profileData.avatar,
                bio: profileData.bio,
            };
            const updated = await updateUser(profileData.id, updateData);
            setProfileData(prev => ({
                ...prev,
                ...updated,
            }));
            setUser(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError("Failed to save profile.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const userStats = [
        { label: "Recipes", value: "12", color: "text-blue-600" },
        { label: "Followers", value: "156", color: "text-green-600" },
        { label: "Following", value: "89", color: "text-purple-600" },
        { label: "Likes", value: "234", color: "text-red-600" },
    ]

    const recentRecipes = [
        {
            id: 1,
            title: "Creamy Mushroom Risotto",
            image: DEFAULT_FOOD_IMAGE,
            likes: 18,
            views: 234,
            createdAt: "2 days ago",
            difficulty: "Medium",
        },
        {
            id: 2,
            title: "Spicy Thai Curry",
            image: DEFAULT_FOOD_IMAGE,
            likes: 25,
            views: 189,
            createdAt: "5 days ago",
            difficulty: "Hard",
        },
        {
            id: 3,
            title: "Classic Caesar Salad",
            image: DEFAULT_FOOD_IMAGE,
            likes: 12,
            views: 156,
            createdAt: "1 week ago",
            difficulty: "Easy",
        },
        {
            id: 4,
            title: "Homemade Pizza Margherita",
            image: DEFAULT_FOOD_IMAGE,
            likes: 31,
            views: 298,
            createdAt: "2 weeks ago",
            difficulty: "Medium",
        },
    ]

    const recentPosts = [
        {
            id: 1,
            title: "5 Essential Cooking Tips for Beginners",
            excerpt:
                "Starting your cooking journey? Here are some fundamental tips that will help you become a better cook...",
            likes: 45,
            comments: 12,
            createdAt: "3 days ago",
        },
        {
            id: 2,
            title: "My Journey to Mastering Italian Cuisine",
            excerpt: "After spending 6 months in Italy, I learned so much about authentic Italian cooking techniques...",
            likes: 67,
            comments: 23,
            createdAt: "1 week ago",
        },
    ]

    const favoriteRecipes = [
        {
            id: 1,
            title: "Grandma's Apple Pie",
            author: "Sarah Johnson",
            image: DEFAULT_FOOD_IMAGE,
            likes: 89,
        },
        {
            id: 2,
            title: "Perfect Chocolate Chip Cookies",
            author: "Mike Chen",
            image: DEFAULT_FOOD_IMAGE,
            likes: 156,
        },
        {
            id: 3,
            title: "Authentic Pad Thai",
            author: "Emma Wilson",
            image: DEFAULT_FOOD_IMAGE,
            likes: 203,
        },
    ]

    const getDifficultyBadge = (difficulty) => {
        const colors = {
            Easy: "bg-green-100 text-green-800",
            Medium: "bg-yellow-100 text-yellow-800",
            Hard: "bg-red-100 text-red-800",
        }
        return <Badge className={colors[difficulty] || "bg-gray-100 text-gray-800"}>{difficulty}</Badge>
    }

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        setProfileData(prev => ({ ...prev, avatarFile: file }));
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    const handleAvatarUpload = async () => {
        if (!profileData.avatarFile) return;
        setSaving(true);
        try {
            console.log("Avatar file:", profileData.avatarFile);
            console.log("User ID:", profileData.id);
            // 1. Upload the file to Firebase Storage and get the download URL
            const downloadURL = await uploadAvatarToFirebase(profileData.avatarFile, profileData.id);

            // 2. Update the user's avatar in your backend (just the URL, not the file)
            const updateData = {
                avatar: downloadURL,
                // Optionally include other fields you want to update:
                // username: profileData.username,
                // phone_number: profileData.phone_number,
                // bio: profileData.bio,
            };
            const updated = await updateUser(profileData.id, updateData);

            // 3. Update local state and context
            setProfileData(prev => ({
                ...prev,
                avatar: updated.avatar,
                avatarFile: undefined
            }));
            setUser(updated);
            setAvatarPreview(null);
            setError(null);
        } catch (err) {
            setError("Failed to upload avatar.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-orange-500">
                                <ChefHat className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-orange-500">FoodForum</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Feed
                        </Button>
                        <Button
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            className={isEditing ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}
                            disabled={saving}
                        >
                            {isEditing ? (saving ? "Saving..." : "Save Changes") : "Edit Profile"}
                        </Button>
                        <Button
                            variant="outline"
                            className="ml-2"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <Avatar className="h-32 w-32 mx-auto">
                                            <AvatarImage src={profileData.avatar || DEFAULT_FOOD_IMAGE} />
                                            <AvatarFallback className="bg-orange-100 text-orange-600 text-3xl">
                                                {profileData.username ? profileData.username.charAt(0).toUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <Button
                                                size="sm"
                                                className="absolute bottom-2 right-2 rounded-full h-10 w-10 p-0 bg-orange-500 hover:bg-orange-600"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <Input
                                                    value={profileData.username}
                                                    onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                                    className="text-center font-semibold text-lg"
                                                    placeholder="@username"
                                                />
                                                <Input
                                                    value={profileData.phone_number}
                                                    onChange={e => setProfileData({ ...profileData, phone_number: e.target.value })}
                                                    className="text-center"
                                                    placeholder="Phone Number"
                                                />
                                                <Input
                                                    value={profileData.avatar}
                                                    onChange={e => setProfileData({ ...profileData, avatar: e.target.value })}
                                                    className="text-center"
                                                    placeholder="Avatar image URL"
                                                />
                                                <Textarea
                                                    value={profileData.bio}
                                                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                                    placeholder="Tell us about yourself..."
                                                    className="min-h-[100px]"
                                                    maxLength={300}
                                                />
                                                {/* Avatar upload UI hidden for now */}
                                                {/*
                                                <div className="flex flex-col items-center mt-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAvatarFileChange}
                                                    />
                                                    {avatarPreview && (
                                                        <img src={avatarPreview} alt="Avatar Preview" className="h-20 w-20 rounded-full mt-2 object-cover" />
                                                    )}
                                                    <Button onClick={handleAvatarUpload} disabled={saving || !profileData.avatarFile} className="mt-2">
                                                        Upload Avatar
                                                    </Button>
                                                </div>
                                                */}
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl font-bold text-gray-900">{profileData.username}</h1>
                                                <p className="text-gray-500 text-lg">{profileData.email}</p>
                                                {profileData.phone_number && <p className="text-gray-500">{profileData.phone_number}</p>}
                                            </>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {userStats.map((stat) => (
                                            <div key={stat.label} className="text-center p-3 rounded-lg bg-gray-50">
                                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                                <p className="text-sm text-gray-600">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bio and Info */}
                                    <div className="mt-8 space-y-4 text-left">
                                        {isEditing ? (
                                            <Textarea
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="Tell us about yourself..."
                                                className="min-h-[100px]"
                                            />
                                        ) : (
                                            <p className="text-gray-700">{profileData.bio}</p>
                                        )}

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-3 text-orange-500" />
                                                <span>Joined {profileData.joinedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 space-y-3">
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message
                                        </Button>
                                        <Button variant="outline" className="w-full bg-transparent">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Follow
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="recipes" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3 h-12">
                                <TabsTrigger value="recipes" className="text-base">
                                    My Recipes
                                </TabsTrigger>
                                <TabsTrigger value="posts" className="text-base">
                                    Posts
                                </TabsTrigger>
                                <TabsTrigger value="favorites" className="text-base">
                                    Favorites
                                </TabsTrigger>
                            </TabsList>

                            {/* Recipes Tab */}
                            <TabsContent value="recipes">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>My Recipes ({recentRecipes.length})</span>
                                            <Button className="bg-orange-500 hover:bg-orange-600">
                                                <ChefHat className="h-4 w-4 mr-2" />
                                                New Recipe
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {recentRecipes.map((recipe) => (
                                                <div
                                                    key={recipe.id}
                                                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={recipe.image || DEFAULT_FOOD_IMAGE}
                                                            alt={recipe.title}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className="absolute top-3 right-3">{getDifficultyBadge(recipe.difficulty)}</div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{recipe.title}</h3>
                                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                                            <span className="flex items-center">
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                {recipe.views}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                                {recipe.likes}
                                                            </span>
                                                            <span>{recipe.createdAt}</span>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                                                            View Recipe
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Posts Tab */}
                            <TabsContent value="posts">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>My Posts ({recentPosts.length})</span>
                                            <Button className="bg-orange-500 hover:bg-orange-600">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                New Post
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {recentPosts.map((post) => (
                                                <div key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                                                    <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                                {post.likes} likes
                                                            </span>
                                                            <span className="flex items-center">
                                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                                {post.comments} comments
                                                            </span>
                                                            <span>{post.createdAt}</span>
                                                        </div>
                                                        <Button variant="outline" size="sm">
                                                            Read More
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Favorites Tab */}
                            <TabsContent value="favorites">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Favorite Recipes ({favoriteRecipes.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {favoriteRecipes.map((recipe) => (
                                                <div
                                                    key={recipe.id}
                                                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                                >
                                                    <img
                                                        src={recipe.image || DEFAULT_FOOD_IMAGE}
                                                        alt={recipe.title}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-gray-900 mb-1">{recipe.title}</h3>
                                                        <p className="text-sm text-gray-500 mb-3">by {recipe.author}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="flex items-center text-sm text-gray-500">
                                                                <Heart className="h-4 w-4 mr-1 text-red-500" />
                                                                {recipe.likes}
                                                            </span>
                                                            <Button variant="outline" size="sm">
                                                                View
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}