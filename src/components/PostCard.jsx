import { useState } from "react"
import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"
import SearchHighlight from "./SearchHighlight"
import PostStats from "./PostStats"
import { upvotePost, downvotePost } from "../api/votes"
import { Badge } from "./ui/badge";

export function PostCard({
    id,
    title,
    content,
    author,
    commentsCount,
    comments,
    imageUrl, // Keep for backward compatibility
    images, // New images array
    searchTerm, // New prop for search highlighting
    slug, // Add slug prop for navigation
    upvotes = [], // Add upvotes array
    downvotes = [], // Add downvotes array
    viewsCount = 0, // Add views count
    categories,
    status, // Thêm status
}) {
    const navigate = useNavigate()

    // State cho vote
    const [upvotesCount, setUpvotesCount] = useState(upvotes.length)
    const [downvotesCount, setDownvotesCount] = useState(downvotes.length)
    const [userVote, setUserVote] = useState(null) // 'upvote' | 'downvote' | null
    const [loadingVote, setLoadingVote] = useState(false)

    // Lấy user hiện tại từ localStorage
    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("foodforum_auth"))?.user;
        } catch {
            return null;
        }
    })();

    const handlePostClick = () => {
        if (slug) {
            navigate(`/posts/${slug}`)
        } else {
            navigate(`/posts/${id}`)
        }
    }

    const handleUpvote = async (e) => {
        e.stopPropagation()
        if (loadingVote) return
        setLoadingVote(true)
        try {
            const res = await upvotePost(id)
            setUpvotesCount(res.data.upvotes)
            setDownvotesCount(res.data.downvotes)
            // Nếu backend trả về userVote, dùng nó, nếu không thì toggle FE
            setUserVote(res.data.userVote || (userVote === "upvote" ? null : "upvote"))
        } finally {
            setLoadingVote(false)
        }
    }

    const handleDownvote = async (e) => {
        e.stopPropagation()
        if (loadingVote) return
        setLoadingVote(true)
        try {
            const res = await downvotePost(id)
            setUpvotesCount(res.data.upvotes)
            setDownvotesCount(res.data.downvotes)
            setUserVote(res.data.userVote || (userVote === "downvote" ? null : "downvote"))
        } finally {
            setLoadingVote(false)
        }
    }

    // Ưu tiên lấy commentCount từ prop, nếu không có thì từ commentsCount hoặc comments.length
    const displayCommentCount = typeof commentsCount === 'number' ? commentsCount : (typeof commentsCount === 'number' ? commentsCount : (comments && comments.length ? comments.length : 0));

    return (
        <article className="border-b border-gray-200 pb-6">
            <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                    <Button
                        variant={userVote === "upvote" ? "default" : "ghost"}
                        size="sm"
                        className={`p-1 cursor-pointer hover:bg-orange-500 hover:text-white ${userVote === "upvote" ? "bg-orange-500 text-white" : ""}`}
                        onClick={handleUpvote}
                        disabled={loadingVote}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-gray-700">{upvotesCount - downvotesCount}</span>
                    <Button
                        variant={userVote === "downvote" ? "default" : "ghost"}
                        size="sm"
                        className={`p-1 cursor-pointer hover:bg-blue-500 hover:text-white ${userVote === "downvote" ? "bg-blue-500 text-white" : ""}`}
                        onClick={handleDownvote}
                        disabled={loadingVote}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1 cursor-pointer" onClick={handlePostClick}>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <span className="text-orange-500">{Array.isArray(categories) && categories.length > 0 && categories[0] && categories[0].name ? categories[0].name : 'Danh mục'}</span>
                        <button
                            className="font-medium text-gray-700 hover:underline hover:text-orange-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                            onClick={e => {
                                e.stopPropagation();
                                const authorUsername = author.username || author;
                                if (currentUser && authorUsername === currentUser.username) {
                                    navigate(`/profile/${authorUsername}`);
                                } else {
                                    navigate(`/user/${authorUsername}`);
                                }
                            }}
                        >
                            {author.username || author}
                        </button>
                        {/* Badge trạng thái */}
                        {status === 'pending' && <Badge variant="warning">Chờ duyệt</Badge>}
                        {status === 'rejected' && <Badge variant="destructive">Đã từ chối</Badge>}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 hover:text-orange-600 transition-colors">
                        <SearchHighlight text={title} searchTerm={searchTerm} />
                    </h3>
                    {(imageUrl || (images && images.length > 0)) && (
                        <div className="mb-4">
                            <img
                                src={images && images.length > 0 ? images[0].url : imageUrl}
                                alt="Post image"
                                width={200}
                                height={120}
                                className="rounded-lg object-cover w-full h-[400px]"
                            />
                        </div>
                    )}
                    <p className="text-gray-600 mb-4">
                        <SearchHighlight text={content} searchTerm={searchTerm} />
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center justify-between mb-4">
                        <PostStats
                            viewsCount={viewsCount}
                            upvotes={upvotes}
                            downvotes={downvotes}
                            commentCount={displayCommentCount}
                        />
                        <div className="flex items-center gap-1 text-gray-500 text-sm ml-2">
                            <span>💬</span>
                            <span>{displayCommentCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}