import { PostCard } from "./PostCard"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"

export function PostFeed({ posts, onCommentClick, activeBadge, onBadgeChange, loading, error }) {
  const badgeOptions = ["Hot", "New", "Top"]

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bài viết nổi bật</h2>
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
          {loading && <p className="text-gray-500 italic text-sm text-center">Đang tải bài viết...</p>}
          {error && <p className="text-red-500 italic text-sm text-center">{error}</p>}
          <div className="space-y-6">
            {posts.map((post, idx) => (
              <PostCard
                key={post._id || post.id || idx}
                {...post}
                subreddit={typeof post.subreddit === 'object' && post.subreddit !== null ? post.subreddit.name : post.subreddit || ''}
                onCommentClick={onCommentClick}
              />
            ))}
            {posts.length === 0 && !loading && !error && (
              <p className="text-gray-500 italic text-sm text-center">Chưa có bài viết nào.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 