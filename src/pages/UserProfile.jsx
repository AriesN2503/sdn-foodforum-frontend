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
    Clock,
    MessageCircle,
    ChefHat,
    Image as ImageIcon,
    ExternalLink,
    LogOut
} from "lucide-react"
import { getCurrentUser, updateUser, getUserFavoritePosts, getUserById } from "../api/user"
import postsApi from "../api/posts"
import { useAuth } from "../hooks/useAuth"
import { useNavigate, useParams } from "react-router"

// Custom Profile Post Card component
function ProfilePostCard({ post }) {
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleClick = () => {
        navigate(`/post/${post._id}`)
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
            <div className="flex p-4">
                {/* Left side: Thumbnail if available */}
                <div className="mr-4 flex-shrink-0">
                    <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {post.imageUrl ? (
                            <img
                                src={post.imageUrl}
                                alt="Post thumbnail"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/food_placeholder.jpg";
                                }}
                            />
                        ) : Array.isArray(post.images) && post.images.length > 0 && post.images[0].url ? (
                            <img
                                src={post.images[0].url}
                                alt="Post thumbnail"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/food_placeholder.jpg";
                                }}
                            />
                        ) : Array.isArray(post.images) && post.images.length > 0 ? (
                            <img
                                src={`/api/posts/image/${post.images[0]}`}
                                alt="Post thumbnail"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/food_placeholder.jpg";
                                }}
                            />
                        ) : (
                            <img
                                src="/images/food_placeholder.jpg"
                                alt="Post thumbnail"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Right side: Post details */}
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.content}</p>

                    <div className="flex items-center text-xs text-gray-500 space-x-3 mt-auto">
                        {post.category && (
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">
                                {post.category.name || "Uncategorized"}
                            </Badge>
                        )}

                        <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>                        <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            <span>{post.commentCount || 0} comments</span>
                        </div>

                        <div className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            <span>{post.votes || 0} votes</span>
                        </div>

                        {post.recipe && (
                            <Badge variant="outline" className="flex items-center">
                                <ChefHat className="w-3 h-3 mr-1" />
                                <span>Recipe</span>
                            </Badge>
                        )}
                    </div>
                </div>

                <ExternalLink className="w-4 h-4 text-gray-400 self-start ml-2" />
            </div>
        </Card>
    )
}

export function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [favoritePosts, setFavoritePosts] = useState([])
    const [activeTab, setActiveTab] = useState("profile")
    const { user: currentUser, setUser, logout } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams()
    const [isOwnProfile, setIsOwnProfile] = useState(false)

    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        bio: "",
        phone_number: "",
        avatar: ""
    })

    // Load user data on component mount or when id changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadUserData();
            } catch (error) {
                console.error("Error in useEffect:", error);
                setError("Failed to load user data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadUserData = async () => {
        try {
            setLoading(true)
            let user;

            // If id is not provided or it's the current user's id, show the current user's profile
            if (!id || id === currentUser?._id) {
                const userResponse = await getCurrentUser()
                user = userResponse.user
                setIsOwnProfile(true)
            } else {
                // Load another user's profile
                const userResponse = await getUserById(id)
                // Check if userResponse is the user object directly or nested in a user property
                user = userResponse.user || userResponse
                setIsOwnProfile(user?._id === currentUser?._id)
            }

            // Validate that we have a user object before proceeding
            if (!user) {
                throw new Error('User data not found')
            }

            setUserData(user)
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                phone_number: user.phone_number || "",
                avatar: user.avatar || ""
            })

            // Load user's posts
            if (user._id) {
                try {
                    const posts = await postsApi.getPostsByUser(user._id)
                    const postsArray = Array.isArray(posts) ? posts : []
                    setUserPosts(postsArray)

                    // Update the postsCount in userData to ensure consistency
                    setUserData(prevData => ({
                        ...prevData,
                        postsCount: postsArray.length
                    }))
                } catch (error) {
                    console.error('Error loading user posts:', error)
                    setUserPosts([])
                }
            }

            // Load favorite posts only if viewing own profile
            if (isOwnProfile) {
                try {
                    const favoritesResponse = await getUserFavoritePosts()
                    const favoritesArray = Array.isArray(favoritesResponse.posts) ? favoritesResponse.posts : []
                    setFavoritePosts(favoritesArray)

                    // Update the favoritesCount in userData to ensure consistency
                    setUserData(prevData => ({
                        ...prevData,
                        favoritesCount: favoritesArray.length
                    }))
                } catch (error) {
                    console.error('Error loading favorite posts:', error)
                    setFavoritePosts([])
                }
            } else {
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

            await updateUser(userData._id, updateData)

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
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
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
                            {isEditing && isOwnProfile && (
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
                                        <h1 className="text-3xl font-bold">{userData?.username || 'User'}</h1>
                                    )}
                                    <p className="text-gray-600">{userData?.email || 'No email provided'}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm text-gray-500">
                                            Joined {userData?.createdAt ? formatDate(userData.createdAt) : 'Unknown date'}
                                        </span>
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <Button
                                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                        disabled={saving}
                                        className="ml-4"
                                    >
                                        {saving ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        ) : isEditing ? (
                                            <Save className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Edit className="w-4 h-4 mr-2" />
                                        )}
                                        {saving ? 'Saving...' : isEditing ? 'Save' : 'Edit Profile'}
                                    </Button>
                                )}
                            </div>                            {/* Bio */}
                            <div>
                                {isEditing && isOwnProfile ? (
                                    <Textarea
                                        value={profileData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        className="mt-2"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-700">
                                        {userData?.bio || "No bio available"}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 text-sm">
                                <div className="text-center">
                                    <div className="font-bold text-lg">{userPosts.length || 0}</div>
                                    <div className="text-gray-500">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{isOwnProfile ? (favoritePosts.length || 0) : (userData?.favoritesCount || 0)}</div>
                                    <div className="text-gray-500">Favorites</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs for Posts and Favorites */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="posts">Posts ({userPosts.length || 0})</TabsTrigger>
                    {isOwnProfile && (
                        <TabsTrigger value="favorites">Favorites ({favoritePosts.length || 0})</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                {isEditing && isOwnProfile ? (
                                    <Input
                                        value={profileData.phone_number}
                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                        placeholder="Enter phone number"
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="text-gray-700 mt-1">
                                        {userData?.phone_number || "Not provided"}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <p className="text-gray-700 mt-1 capitalize">{userData?.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Member Since</label>
                                <p className="text-gray-700 mt-1">{formatDate(userData?.createdAt)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="posts">
                    <Card>
                        <CardHeader>
                            <CardTitle>{isOwnProfile ? "My Posts" : `${userData?.username}'s Posts`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userPosts.length > 0 ? (
                                <div className="space-y-3">
                                    {userPosts.map((post) => (
                                        <ProfilePostCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">No posts yet</p>
                                    {isOwnProfile && (
                                        <>
                                            <p className="text-sm text-gray-400">
                                                Share your first post to get started!
                                            </p>
                                            <Button
                                                onClick={() => navigate('/create-post')}
                                                className="mt-4 bg-orange-500 hover:bg-orange-600"
                                            >
                                                Create Post
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="favorites">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {favoritePosts.length > 0 ? (
                                <div className="space-y-3">
                                    {favoritePosts.map((post) => (
                                        <ProfilePostCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">No favorite posts yet</p>
                                    <p className="text-sm text-gray-400">
                                        Start exploring and heart the posts you love!
                                    </p>
                                    <Button
                                        onClick={() => navigate('/')}
                                        className="mt-4 bg-orange-500 hover:bg-orange-600"
                                    >
                                        Explore Posts
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Logout Button - only show on own profile */}
            {isOwnProfile && (
                <Button
                    variant="outline"
                    className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            )}
        </div>
    )
}

export default UserProfile
