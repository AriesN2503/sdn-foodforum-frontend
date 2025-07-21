import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown, ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import postsApi from "../api/posts"

function RecipeCard({ recipe }) {
    if (!recipe) return null;

    return (
        <Card className="mt-6">
            <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-800">Recipe Details</h3>
                </div>

                {/* Recipe Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Prep Time</p>
                            <p className="font-semibold">{recipe.prepTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Cook Time</p>
                            <p className="font-semibold">{recipe.cookTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Servings</p>
                            <p className="font-semibold">{recipe.servings}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ChefHat className="h-4 w-4 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Difficulty</p>
                            <p className="font-semibold">{recipe.difficulty}</p>
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                        {recipe.ingredients?.map((ingredient, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <span className="text-gray-700">{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instructions */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h4>
                    <ol className="space-y-3">
                        {recipe.instructions?.map((instruction, index) => (
                            <li key={index} className="flex space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </span>
                                <span className="text-gray-700 leading-relaxed">{instruction}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </CardContent>
        </Card>
    )
}

function CommentComponent({ comment, depth = 0 }) {
    const [isReplying, setIsReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(true)
    const [replyText, setReplyText] = useState("")

    const handleReply = () => {
        if (replyText.trim()) {
            // Handle reply logic here
            console.log('Reply:', replyText)
            setReplyText("")
            setIsReplying(false)
        }
    }

    return (
        <div className={`${depth > 0 ? 'ml-8 border-l border-gray-200 pl-4' : ''}`}>
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-800">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center space-y-1">
                        <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                            <ChevronUp className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-semibold text-gray-600">{comment.votes}</span>
                        <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4 text-sm">
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-gray-500 hover:text-orange-500 cursor-pointer"
                            >
                                Reply
                            </button>
                            {comment.replies && comment.replies.length > 0 && (
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="text-gray-500 hover:text-orange-500 cursor-pointer"
                                >
                                    {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
                                </button>
                            )}
                        </div>

                        {isReplying && (
                            <div className="mt-3 space-y-2">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    rows="3"
                                />
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleReply}
                                        className="bg-orange-500 hover:bg-orange-600 text-white"
                                        size="sm"
                                    >
                                        Reply
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsReplying(false)
                                            setReplyText("")
                                        }}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReplies && comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4 mt-4">
                    {comment.replies.map((reply) => (
                        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function PostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState([])
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const postData = await postsApi.getPostById(id)
                setPost(postData)
                // You can also fetch comments here if you have a comments API
                // const commentsData = await commentsApi.getCommentsByPostId(id)
                // setComments(commentsData)
            } catch (err) {
                setError(err.message || 'Failed to fetch post')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchPost()
        }
    }, [id])

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading post...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "The post you're looking for doesn't exist."}</p>
                        <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 text-white !cursor-pointer">
                            Go Back Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handlePostComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                author: "u/currentuser",
                content: newComment,
                timestamp: "just now",
                votes: 0,
                replies: []
            }
            setComments([comment, ...comments])
            setNewComment("")
        }
    }

    // Format timestamp
    const formatTimestamp = (date) => {
        if (!date) return 'Unknown time'
        const now = new Date()
        const postDate = new Date(date)
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60))

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="mb-4 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Feed
            </Button>

            {/* Post Content */}
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center space-y-2">
                            <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold text-gray-700 text-lg">{post.votes || 0}</span>
                            <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                    {post.subreddit || post.category || 'General'}
                                </Badge>
                                {post.recipe && (
                                    <Badge className="bg-orange-500 text-white">
                                        <ChefHat className="h-3 w-3 mr-1" />
                                        Recipe Included
                                    </Badge>
                                )}
                                <span className="text-sm text-gray-500">Posted by {post.author?.username || 'Unknown'}</span>
                                <span className="text-sm text-gray-500">{formatTimestamp(post.createdAt)}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">{post.title}</h1>
                            {post.imageUrl && (
                                <div className="mb-6">
                                    <img
                                        src={post.imageUrl}
                                        alt="Post image"
                                        className="rounded-lg object-cover w-full h-[500px]"
                                    />
                                </div>
                            )}
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.content}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500 border-t pt-4">
                                <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{post.commentCount || 0} Comments</span>
                                </div>
                                <button className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer">
                                    <Share className="h-4 w-4" />
                                    <span>Share</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer">
                                    <Bookmark className="h-4 w-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recipe Card */}
            {post.recipe && <RecipeCard recipe={post.recipe} />}

            {/* Comment Section */}
            <Card>
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments</h2>

                    {/* Add Comment */}
                    <div className="mb-8">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows="4"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handlePostComment}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                disabled={!newComment.trim()}
                            >
                                Post Comment
                            </Button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => (
                                <CommentComponent key={comment.id} comment={comment} />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
