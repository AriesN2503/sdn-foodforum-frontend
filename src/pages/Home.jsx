import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { PostFeed } from "../components/PostFeed"
import postsApi from "../api/posts"
import categoriesApi from "../api/categories"
import { useCategory } from "../hooks/useCategory"

export default function Home() {
    const { selectedCategory } = useCategory()
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadCategories = async () => {
        try {
            const categoriesData = await categoriesApi.getAllCategories()
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error loading categories:', error)
            setError('Failed to load categories')
        }
    }

    const loadPosts = async (filter) => {
        try {
            setLoading(true)
            let postsData = []

            // Check if filter is a category name or default filter
            const category = categories.find(cat => cat.name.toLowerCase() === filter.toLowerCase())

            if (category) {
                postsData = await postsApi.getPostsByCategory(category._id)
            } else {
                postsData = await postsApi.getPostsByFilter(filter.toLowerCase())
            }

            // Transform posts to match frontend format
            const transformedPosts = postsData.map(post => ({
                id: post._id,
                title: post.title,
                content: post.content,
                author: post.author?.username || 'Anonymous',
                subreddit: post.category?.subreddit || 'r/general',
                timestamp: formatTimestamp(post.createdAt),
                votes: post.votes,
                commentCount: post.commentCount,
                imageUrl: post.imageUrl, // Keep for backward compatibility
                images: post.images || [], // Add images array
                category: post.category
            }))

            setPosts(transformedPosts)
            setError(null)
        } catch (error) {
            console.error('Error loading posts:', error)
            setError('Failed to load posts')
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    // Load categories and posts on component mount
    useEffect(() => {
        loadCategories()
        loadPosts("Hot")
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Load posts when selected category changes
    useEffect(() => {
        if (categories.length > 0) {
            loadPosts(selectedCategory)
        }
    }, [selectedCategory, categories]) // eslint-disable-line react-hooks/exhaustive-deps

    const formatTimestamp = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now - date
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInHours < 1) {
            return `${Math.floor(diffInMs / (1000 * 60))} mins ago`
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
        } else {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
        }
    }

    const handleCommentClick = (postId) => {
        // Navigate to post detail page instead of opening modal
        navigate(`/post/${postId}`)
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
                selectedCategory={selectedCategory}
                loading={loading}
            />
        </>
    )
}
