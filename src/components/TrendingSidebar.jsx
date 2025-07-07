import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export function TrendingSidebar() {
  const trendingTopics = ["#SourdoughStarter", "#AirFryerRecipes", "#PlantBased", "#MealPrep"]

  const popularCommunities = [
    { name: "r/recipes", members: "2.1M members" },
    { name: "r/food", members: "1.8M members" },
  ]

  return (
    <aside className="w-full space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-orange-500 mb-4">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="text-orange-500 border-orange-200 hover:bg-orange-50">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-orange-500 mb-4">Popular Communities</h3>
          <div className="space-y-4">
            {popularCommunities.map((community) => (
              <div key={community.name} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{community.name}</h4>
                  <p className="text-sm text-gray-500">{community.members}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-orange-500 mb-4">Recipe of the Day</h3>
          <div className="space-y-3">
            <img
              src="https://i.pinimg.com/736x/78/2e/b5/782eb52c3d668c2778b346288fb20f8a.jpg"
              alt="Recipe of the day"
              width={200}
              height={120}
              className="rounded-lg object-cover w-full h-[200px]"
            />

            <h4 className="font-medium text-gray-800">Creamy Mushroom Risotto</h4>
            <p className="text-sm text-gray-600">A rich and creamy Italian classic perfect for dinner.</p>
            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
              View Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
