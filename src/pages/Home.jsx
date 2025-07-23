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
            console.log('Categories loaded:', categoriesData)
            setCategories(categoriesData)
            return categoriesData // Return the data for immediate use
        } catch (error) {
            console.error('Error loading categories:', error)
            setError('Failed to load categories')
            return [] // Return empty array on error
        }
    }

    // Helper function to process posts data and update state
    const processAndDisplayPosts = (postsData) => {
        try {
            if (!postsData || !Array.isArray(postsData)) {
                console.error('Invalid posts data received:', postsData)
                setPosts([])
                return
            }

            // Debug: Log incoming posts before filtering
            console.log('Processing posts data, count before filtering:', postsData.length)

            // Filter only approved posts for the home page if they have a status field
            // Otherwise, include all posts (backend might not set status on all posts)
            const filteredPosts = postsData.filter(post => {
                // If post has no status field or status is approved, include it
                const include = !post.status || post.status === 'approved'
                return include
            })

            console.log('Posts after filtering:', filteredPosts.length)

            // Transform posts to match frontend format
            const transformedPosts = filteredPosts.map(post => ({
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
            console.error('Error processing posts:', error)
            setError('Failed to process posts data')
            setPosts([])
        }
    }

    // Load posts based on filter type (sorting filter or category filter)
    const loadPostsWithCategories = async (filter, availableCategories) => {
        try {
            console.log('Selected filter/category:', filter)
            console.log('Provided categories for lookup:', availableCategories)

            // Define special filters that sort posts differently
            const specialFilters = ['new', 'hot', 'top']

            // Convert to lowercase for case-insensitive comparison
            const filterLower = filter.toLowerCase()

            let postsData = []

            // First check if it's a special sort filter (new, hot, top)
            if (specialFilters.includes(filterLower)) {
                console.log('Using special sort filter:', filterLower)
                postsData = await postsApi.getPostsByFilter(filterLower)
                console.log('Posts data from filter:', postsData)
            } else {
                // Try to find category by name (only if not a special filter)
                const category = availableCategories.find(
                    cat => cat.name.toLowerCase() === filterLower
                )
                console.log('Found category object:', category)

                if (category && category._id) {
                    console.log('Fetching by category ID:', category._id)
                    try {
                        postsData = await postsApi.getPostsByCategory(category._id)
                        console.log('Posts data from category:', postsData)
                    } catch (categoryError) {
                        console.error('Error in getPostsByCategory:', categoryError)
                        setError(`Failed to load posts for category: ${categoryError.message}`)
                        // Fallback to new filter on error
                        postsData = await postsApi.getPostsByFilter('new')
                    }
                } else {
                    // Fallback to "new" filter if no category found
                    console.log('No matching category found, using default filter')
                    postsData = await postsApi.getPostsByFilter('new')
                }
            }

            return postsData
        } catch (error) {
            console.error('Error in loadPostsWithCategories:', error)
            setError(`Failed to load posts: ${error.message}`)
            return []
        }
    }

    const loadPosts = async (filter) => {
        try {
            setLoading(true)
            setError(null) // Clear any previous errors

            // Normalize filter to lowercase to ensure consistency
            const normalizedFilter = filter?.toLowerCase() || 'new'

            // Use the loadPostsWithCategories function with current categories state
            let postsData = await loadPostsWithCategories(normalizedFilter, categories)

            // Process and display the loaded posts
            processAndDisplayPosts(postsData)
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
        async function initializeData() {
            // First load all categories
            const loadedCategories = await loadCategories()
            console.log('Categories loaded in useEffect:', loadedCategories)

            // Then load initial posts with the "new" filter (not a category)
            const postsData = await loadPostsWithCategories("new", loadedCategories)
            processAndDisplayPosts(postsData)
        }

        initializeData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Load posts when selected category or filter changes
    useEffect(() => {
        if (categories.length > 0) {
            console.log('Category or filter changed, reloading posts with:', selectedCategory)
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