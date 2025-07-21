import { Home, TrendingUp, ChefHat, MapPin, Coffee, Cake, Heart, Globe, Users } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect } from "react"
import categoriesApi from "../api/categories"

export function CategoriesSidebar({ onCategorySelect, selectedCategory }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCategories()
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

    const communities = [{ label: "Italian Cuisine" }, { label: "Vegan Recipes" }]

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
                                        onClick={() => onCategorySelect(category.name)}
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
                    <h3 className="font-semibold text-orange-500 mb-4">My Communities</h3>
                    <div className="space-y-3">
                        {communities.map((community) => (
                            <a
                                key={community.label}
                                href="#"
                                className="flex items-center space-x-3 text-gray-700 hover:text-orange-500"
                            >
                                <Users className="h-4 w-4" />
                                <span>{community.label}</span>
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}
