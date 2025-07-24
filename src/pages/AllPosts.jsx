import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { CommentsModal } from "../components/CommentsModal"
import { PostFeed } from "../components/PostFeed"
import Pagination from "../components/Pagination"
import PostsFilter from "../components/PostsFilter"
import postsApi from "../api/posts"
import { useToast } from "../context/ToastContext"
import { useLocation } from "react-router-dom";


export default function AllPosts() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [posts, setPosts] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { toast } = useToast()
    const location = useLocation();
    const categoryName = location.state?.categoryName;


    // Get filters from URL params
    const getFiltersFromURL = () => ({
        page: parseInt(searchParams.get('page')) || 1,
        limit: parseInt(searchParams.get('limit')) || 10,
        search: searchParams.get('search') || '',
        sort: searchParams.get('sort') || 'newest',
        categorySlugs: searchParams.get('categorySlugs') || '',
        maxTotalTime: searchParams.get('maxTotalTime') || '',
        authorUsername: searchParams.get('authorUsername') || ''
    })

    // Update URL params
    const updateURLParams = (filters) => {
        const newSearchParams = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                newSearchParams.set(key, value.toString())
            }
        })
        setSearchParams(newSearchParams)
    }

    const loadPosts = async (filters) => {
        try {
            console.log('Loading posts with filters:', filters)
            setLoading(true)

            const response = await postsApi.getAllPosts(filters)

            const { posts: postsData, pagination: paginationData } = response

            // Transform posts to match frontend format
            const transformedPosts = postsData.map(post => ({
                id: post._id,
                title: post.title,
                content: post.content,
                author: post.author?.username || 'Anonymous',
                subreddit: post.category?.subreddit || 'r/general',
                timestamp: formatTimestamp(post.createdAt),
                votes: post.votes,
                commentsCount: post.commentsCount || 0,
                comments: post.comments || [],
                imageUrl: post.imageUrl,
                images: post.images || [],
                category: post.category,
                thumbnailUrl: post.thumbnailUrl,
                description: post.description,
                slug: post.slug, // Add slug for navigation
                upvotes: post.upvotes || [], // Add upvotes array
                downvotes: post.downvotes || [], // Add downvotes array
                viewsCount: post.viewsCount || 0, // Add views count
                categories: post.categories || []
            }))


            setPosts(transformedPosts)
            setPagination(paginationData)
            setError(null)
        } catch (error) {
            console.error('Error loading posts:', error)
            setError('Không thể tải danh sách bài viết')
            setPosts([])
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách bài viết",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    // Load posts when component mounts or URL params change
    useEffect(() => {
        const filters = getFiltersFromURL()
        loadPosts(filters)
    }, [searchParams])

    const handleFiltersChange = (newFilters) => {
        // Merge filter mới với filter hiện tại từ URL
        updateURLParams({ ...getFiltersFromURL(), ...newFilters })
    }

    const handleSearch = (searchTerm) => {
        const currentFilters = getFiltersFromURL()
        const newFilters = {
            ...currentFilters,
            search: searchTerm,
            page: 1 // Reset to first page when searching
        }
        updateURLParams(newFilters)
    }

    const handlePageChange = (page) => {
        const currentFilters = getFiltersFromURL()
        const newFilters = {
            ...currentFilters,
            page
        }
        updateURLParams(newFilters)
    }

    const formatTimestamp = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)

        if (diffInSeconds < 60) {
            return 'Vừa xong'
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60)
            return `${minutes} phút trước`
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600)
            return `${hours} giờ trước`
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400)
            return `${days} ngày trước`
        } else {
            return date.toLocaleDateString('vi-VN')
        }
    }

    const handleCommentClick = (postId) => {
        setSelectedPostId(postId)
        setIsCommentsOpen(true)
    }

    const handleCloseComments = () => {
        setIsCommentsOpen(false)
        setSelectedPostId(null)
        setNewComment("")
        setReplyingTo(null)
        setReplyText("")
    }

    const currentFilters = getFiltersFromURL()

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-600 mb-2">Tất cả bài viết</h1>
                    <p className="text-gray-600">Khám phá tất cả các bài viết trong cộng đồng FoodForum</p>
                </div>

                <PostsFilter
                    filters={getFiltersFromURL()}
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    className="mb-8"
                />

                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-orange-600 mb-8">Tất cả bài viết</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => loadPosts(currentFilters)}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-orange-600 mb-2">Tất cả bài viết</h1>
                <p className="text-gray-600">Khám phá tất cả các bài viết trong cộng đồng FoodForum</p>
                <div className="mt-4 text-sm text-gray-500">
                    Tổng cộng {pagination.totalPosts} bài viết • Trang {pagination.currentPage} / {pagination.totalPages}
                </div>
            </div>

            {/* Filters */}
            <PostsFilter
                filters={getFiltersFromURL()}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                className="mb-8"
            />

            {/* Posts */}
            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {getFiltersFromURL().search ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
                    </h3>
                    <p className="text-gray-500">
                        {getFiltersFromURL().search
                            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                            : 'Hãy là người đầu tiên chia sẻ công thức nấu ăn!'
                        }
                    </p>
                </div>
            ) : (
                <>
                    <PostFeed
                        posts={posts}
                        searchTerm={getFiltersFromURL().search}
                        onCommentClick={handleCommentClick}
                        selectedCategory={categoryName}
                    />

                    {/* Pagination */}
                    <div className="mt-8">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

            <CommentsModal
                isOpen={isCommentsOpen}
                onClose={handleCloseComments}
                postId={selectedPostId}
                comments={[]} // Sẽ được load từ API
                newComment={newComment}
                setNewComment={setNewComment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
            />
        </div>
    )
} 