import { Home, TrendingUp, ChefHat, MapPin, Coffee, Cake, Heart, Globe, Users } from "lucide-react"
import { Card, CardContent } from "./ui/card"

export function CategoriesSidebar() {
    const categories = [
        { icon: Home, label: "Home" },
        { icon: TrendingUp, label: "Popular" },
        { icon: ChefHat, label: "Recipes" },
        { icon: MapPin, label: "Restaurants" },
        { icon: Coffee, label: "Drinks" },
        { icon: Cake, label: "Desserts" },
        { icon: Heart, label: "Healthy" },
        { icon: Globe, label: "International" },
    ]

    const communities = [{ label: "Italian Cuisine" }, { label: "Vegan Recipes" }]

    return (
        <aside className="w-full space-y-6">
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-orange-500 mb-4">Categories</h3>
                    <nav className="space-y-2">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <a
                                    key={category.label}
                                    href="#"
                                    className="flex items-center space-x-3 text-gray-700 hover:text-orange-500 py-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{category.label}</span>
                                </a>
                            )
                        })}
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
