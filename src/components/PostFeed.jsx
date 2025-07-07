import { PostCard } from "./PostCard"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

export function PostFeed({ posts, onCommentClick, activeBadge, onBadgeChange }) {
  const badgeOptions = ["Hot", "New", "Top"]

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Popular Food Posts</h2>
            <div className="flex space-x-2">
              {badgeOptions.map((badge) => (
                <Badge
                  key={badge}
                  onClick={() => onBadgeChange(badge)}
                  className={`cursor-pointer ${activeBadge === badge
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-transparent text-orange-500 border-orange-500 hover:bg-orange-50"
                    }`}
                  variant={activeBadge === badge ? "default" : "outline"}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} onCommentClick={onCommentClick} />
            ))}
            {posts.length === 0 && (
              <p className="text-gray-500 italic text-sm text-center">No posts in this category yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}