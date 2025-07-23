import { Home, TrendingUp, ChefHat, MapPin, Coffee, Cake, Heart, Globe, User } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect } from "react"
import categoriesApi from "../api/categories"
import { getUsers } from "../api/user"
import { useNavigate } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function CategoriesSidebar({ onCategorySelect, selectedCategory }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadCategories()
        loadUsers()
    }, [])

    const loadCategories = async () => {
        try {
            const categoriesData = await categoriesApi.getAllCategories()
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error loading categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadUsers = async () => {
        try {
            setLoadingUsers(true)
            const usersData = await getUsers()
            // Filter users with role 'user' and limit to 8
            const filteredUsers = usersData
                .filter(user => user.role === 'user')
                .slice(0, 5)
            setUsers(filteredUsers)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`)
    }

    // Icon mapping for categories
    const iconMap = {
        'Home': Home,
        'Hot': TrendingUp,
        'Popular': TrendingUp,
        'Recipes': ChefHat,
        'Restaurants': MapPin,
        'Drinks': Coffee,
        'Desserts': Cake,
        'Healthy': Heart,
        'International': Globe,
        'Baking': ChefHat,
        'Quick Meals': Coffee,
        'Comfort Food': Heart,
        'New': TrendingUp,
        'Top': TrendingUp
    }

    const getIcon = (categoryName) => {
        return iconMap[categoryName] || ChefHat
    }

    return (
        <aside className="w-full space-y-6">
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-orange-500 mb-4">Categories</h3>
                    <nav className="space-y-2">
                        {loading ? (
                            <div className="text-gray-500">Loading categories...</div>
                        ) : (
                            categories.map((category) => {
                                const Icon = getIcon(category.name)
                                const isSelected = selectedCategory === category.name
                                return (
                                    <button
                                        key={category._id}
                                        onClick={() => {
                                            // If the category is already selected, deselect it and go to New posts
                                            if (isSelected) {
                                                onCategorySelect("New")
                                            } else {
                                                onCategorySelect(category.name)
                                            }
                                        }}
                                        className={`flex items-center space-x-3 w-full text-left py-2 px-2 rounded transition-colors ${isSelected
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                                            }`}
                                    >
                                        <span className="text-lg">{category.icon}</span>
                                        <span>{category.name}</span>
                                    </button>
                                )
                            })
                        )}
                    </nav>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-orange-500 mb-4">People You May Know</h3>
                    <div className="space-y-3">
                        {loadingUsers ? (
                            <div className="text-gray-500">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="text-gray-500">No users found</div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar} alt={user.username} />
                                        <AvatarFallback>
                                            {user.username ? user.username.substring(0, 2).toUpperCase() : <User className="h-6 w-6" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.username}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}
