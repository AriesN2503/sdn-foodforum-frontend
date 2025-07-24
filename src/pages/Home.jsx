import { useState, useEffect } from "react"
import { CommentsModal } from "../components/CommentsModal"
import { PostFeed } from "../components/PostFeed"
import postsApi from "../api/posts"
import { useCategory } from "../hooks/useCategory"


export default function Home() {
    const { selectedCategory } = useCategory()
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [activeBadge, setActiveBadge] = useState("Hot")
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const loadPosts = async (filter) => {
        try {
            setLoading(true)
            let postsData = []
            if (typeof filter === 'object' && filter !== null) {
                // Nếu là object, gọi API với params
                const res = await postsApi.getAllPosts(filter)
                if (res && Array.isArray(res.posts)) {
                    postsData = res.posts
                } else if (Array.isArray(res)) {
                    postsData = res
                } else {
                    postsData = []
                }
            } else {
                // Đoạn này bỏ qua logic categories vì không còn biến categories
                // else {
                //     postsData = await postsApi.getPostsByFilter(filter.toLowerCase())
                // }
            }

            // Transform posts to match frontend format
            const transformedPosts = postsData.map(post => ({
                id: post._id,
                title: post.title,
                content: post.description, // Sử dụng description thay vì content nếu có
                author: typeof post.author === 'object' && post.author !== null ? post.author.username : (post.author || 'Ẩn danh'),
                thumbnailUrl: post.thumbnailUrl,
                categories: post.categories || [],
                slug: post.slug,
                viewsCount: post.viewsCount || 0,
                upvotes: post.upvotes || [],
                downvotes: post.downvotes || [],
                comments: post.comments || [],
                commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : 0,
                createdAt: post.createdAt,
                // Thêm các trường khác nếu cần
            }))

            
            setPosts(transformedPosts)
        } catch (error) {
            console.error('Error loading posts:', error)
        } finally {
            setLoading(false)
        }
    }

    // Load 10 bài post phổ biến nhất dựa trên view count khi mount
    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                setLoading(true);
                const res = await postsApi.getAllPosts({ sort: 'views', limit: 10 });
                setPosts(res.posts || []);
            } catch (error) {
                setError('Không thể tải bài viết phổ biến');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularPosts();
    }, []);

    // Bỏ useEffect này vì không còn biến categories

    const handleCommentClick = () => {
        setIsCommentsOpen(true)
    }

    return (
        <>
            <PostFeed
                posts={posts}
                onCommentClick={handleCommentClick}
                activeBadge={activeBadge}
                onBadgeChange={setActiveBadge}
                loading={loading}
                searchTerm=""
                selectedCategory={selectedCategory}
            />

        </>
    )
}
