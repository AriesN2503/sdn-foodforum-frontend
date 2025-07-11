import { useState } from "react"
import { Link } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import {
    Camera,
    MapPin,
    Calendar,
    Globe,
    Save,
    Edit,
    ChefHat,
    Coffee,
    Heart,
    MessageSquare,
    Eye,
    ThumbsUp,
    ArrowLeft,
} from "lucide-react"

const DEFAULT_FOOD_IMAGE = 'https://i.pinimg.com/736x/02/6b/01/026b01f777c272eb91173ae461ef0116.jpg'

export function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        bio: "Passionate home cook and food enthusiast. Love sharing recipes and discovering new flavors from around the world!",
        location: "San Francisco, CA",
        website: "https://johndoe.com",
        joinedDate: "January 2023",
    })

    const handleSave = () => {
        // Handle save logic
        console.log("Saving profile data:", profileData)
        setIsEditing(false)
    }

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
                        >
                            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                            {isEditing ? "Save Changes" : "Edit Profile"}
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
                                            <AvatarImage src={DEFAULT_FOOD_IMAGE} />
                                            <AvatarFallback className="bg-orange-100 text-orange-600 text-3xl">JD</AvatarFallback>
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
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="text-center font-semibold text-lg"
                                                />
                                                <Input
                                                    value={profileData.username}
                                                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                    className="text-center"
                                                    placeholder="@username"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                                                <p className="text-gray-500 text-lg">@{profileData.username}</p>
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
                                                <MapPin className="h-4 w-4 mr-3 text-orange-500" />
                                                {isEditing ? (
                                                    <Input
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                        className="h-8 flex-1"
                                                    />
                                                ) : (
                                                    <span>{profileData.location}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Globe className="h-4 w-4 mr-3 text-orange-500" />
                                                {isEditing ? (
                                                    <Input
                                                        value={profileData.website}
                                                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                                        className="h-8 flex-1"
                                                    />
                                                ) : (
                                                    <a href={profileData.website} className="text-orange-500 hover:underline">
                                                        {profileData.website}
                                                    </a>
                                                )}
                                            </div>
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