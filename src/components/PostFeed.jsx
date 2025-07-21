import { PostCard } from "./PostCard"
import { Card, CardContent } from "./ui/card"

export function PostFeed({ posts, onCommentClick, loading, selectedCategory }) {
  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory ? `${selectedCategory} Posts` : 'Popular Food Posts'}
            </h2>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-2 text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} {...post} onCommentClick={onCommentClick} />
              ))
            ) : (
              <p className="text-gray-500 italic text-sm text-center py-8">No posts in this category yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}