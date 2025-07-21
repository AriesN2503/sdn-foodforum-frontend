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
import { getCurrentUser, updateUser, getUserFavoritePosts, getCurrentUserPosts } from "../api/user"
import postsApi from "../api/posts"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router"
import { PostCard } from "../components/PostCard"
import MyPost from "../components/profile/MyPost"
import ConfirmationModal from "../components/admin/ConfirmationModal";

export function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [favoritePosts, setFavoritePosts] = useState([])
    const [activeTab, setActiveTab] = useState("profile")
    const { setUser } = useAuth()
    const navigate = useNavigate()
    const [showBannedModal, setShowBannedModal] = useState(false);

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

    useEffect(() => {
        if (userData && userData.status === 'banned') {
            setShowBannedModal(true);
        } else {
            setShowBannedModal(false);
        }
    }, [userData]);

    const loadUserData = async () => {
        try {
            setLoading(true)

            // Get current user data
            const user = await getCurrentUser()
            setUserData(user)
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                phone_number: user.phone_number || "",
                avatar: user.avatar || ""
            })

            // Load user's posts
            try {
                const posts = await getCurrentUserPosts()
                setUserPosts(Array.isArray(posts) ? posts : [])
            } catch (error) {
                console.error('Error loading user posts:', error)
                setUserPosts([])
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
            {/* Banned user modal */}
            <ConfirmationModal
                open={showBannedModal}
                title="Account Banned"
                message="Your account has been banned. You cannot create or manage posts. Please contact support if you believe this is a mistake."
                onConfirm={() => setShowBannedModal(false)}
                onCancel={() => setShowBannedModal(false)}
                confirmText="OK"
                cancelText=""
            />
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
                            </div>

                            {/* Bio */}
                            <div>
                                {isEditing ? (
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
                                    <div className="font-bold text-lg">{userData?.postsCount || 0}</div>
                                    <div className="text-gray-500">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{userData?.favoritesCount || 0}</div>
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
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="posts">My Posts ({userPosts.filter(post => post.status === 'active').length})</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites ({favoritePosts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                {isEditing ? (
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
                    <MyPost userPosts={userPosts} navigate={navigate} />
                </TabsContent>

                <TabsContent value="favorites">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {favoritePosts.length > 0 ? (
                                <div className="space-y-4">
                                    {favoritePosts.map((post) => (
                                        <PostCard key={post._id} post={post} />
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
                                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        Explore Posts
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserProfile
