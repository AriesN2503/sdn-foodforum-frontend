import { PostCard } from "./PostCard"
import { Card, CardContent } from "./ui/card"

export function PostFeed({ posts, onCommentClick, loading, selectedCategory, searchTerm }) {
    
    console.log('selectedCategory: ', selectedCategory);

    return (
        <div className="w-full">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {selectedCategory ? `Bài Viết ${selectedCategory}` : 'Bài Viết Mới Nhất'}
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                <p className="mt-2 text-gray-500">Đang tải bài viết...</p>
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    {...post}
                                    commentsCount={post.commentsCount}
                                    searchTerm={searchTerm}
                                    onCommentClick={onCommentClick}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-sm text-center py-8">Không có bài viết nào trong danh mục này.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}