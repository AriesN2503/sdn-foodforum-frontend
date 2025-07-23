import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect } from "react"
import postsApi from "../api/posts"
import { useNavigate } from "react-router"

export function TrendingSidebar() {
  const navigate = useNavigate()
  const [topRecipe, setTopRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  const trendingTopics = ["#SourdoughStarter", "#AirFryerRecipes", "#PlantBased", "#MealPrep"]

  const popularCommunities = [
    { name: "r/recipes", members: "2.1M members" },
    { name: "r/food", members: "1.8M members" },
  ]

  useEffect(() => {
    const fetchTopRecipe = async () => {
      try {
        setLoading(true)
        // Fetch posts with "hot" filter to get the most voted posts
        const hotPosts = await postsApi.getPostsByFilter('hot')

        // Get the first post (most voted) that has images
        const topPost = hotPosts.find(post => post.images && post.images.length > 0)
        setTopRecipe(topPost)
      } catch (error) {
        console.error('Error fetching top recipe:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRecipe()
  }, [])

  const handleViewRecipe = () => {
    if (topRecipe && topRecipe._id) {
      navigate(`/post/${topRecipe._id}`)
    }
  }

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
          <h3 className="font-semibold text-orange-500 mb-4">Recipe of the Week</h3>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="bg-gray-200 rounded-lg w-full h-[200px]"></div>
              <div className="bg-gray-200 h-5 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-200 h-8 w-full rounded"></div>
            </div>
          ) : topRecipe ? (
            <div className="space-y-3 cursor-pointer" onClick={handleViewRecipe}>
              <img
                src={topRecipe.images && topRecipe.images.length > 0
                  ? topRecipe.images[0].url
                  : topRecipe.imageUrl || "/images/food_placeholder.jpg"}
                alt={topRecipe.title || "Recipe of the week"}
                width={200}
                height={120}
                className="rounded-lg object-cover w-full h-[200px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/food_placeholder.jpg";
                }}
              />

              <h4 className="font-medium text-gray-800">{topRecipe.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{topRecipe.content}</p>
              <Button
                size="sm"
                className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewRecipe()
                }}
              >
                View Recipe
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <img
                src="/images/food_placeholder.jpg"
                alt="Recipe of the week"
                width={200}
                height={120}
                className="rounded-lg object-cover w-full h-[200px]"
              />

              <h4 className="font-medium text-gray-800">No recipes found</h4>
              <p className="text-sm text-gray-600">Check back later for the top recipe of the week.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
