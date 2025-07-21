import { useState, useEffect } from "react"
import { CommentsModal } from "../components/CommentsModal"
import { PostFeed } from "../components/PostFeed"
import { getPosts } from "../api/post"
import { useCategory } from "../hooks/useCategory";

export default function Home() {
    const { selectedCategory } = useCategory()
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [activeBadge, setActiveBadge] = useState("Hot")
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        // Có thể map badge sang tag nếu backend hỗ trợ
        getPosts()
            .then(res => {
                setPosts(res.data?.posts || res.data || [])
            })
            .catch(() => {
                setError("Không thể tải danh sách bài post.")
            })
            .finally(() => setLoading(false))
    }, [activeBadge])

    const handleCommentClick = () => {
        setIsCommentsOpen(true)
    }

    return (
        <>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <PostFeed
                posts={posts}
                onCommentClick={handleCommentClick}
                activeBadge={activeBadge}
                onBadgeChange={setActiveBadge}
                loading={loading}
                error={error}
            />

            <CommentsModal
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                comments={[]}
                newComment={newComment}
                onNewCommentChange={setNewComment}
                onPostComment={() => {
                    setNewComment("")
                }}
                replyingTo={replyingTo}
                replyText={replyText}
                onReply={setReplyingTo}
                onPostReply={() => {
                    setReplyText("")
                    setReplyingTo(null)
                }}
                onCancelReply={() => {
                    setReplyingTo(null)
                    setReplyText("")
                }}
                onReplyTextChange={setReplyText}
            />
        </>
    )
}
