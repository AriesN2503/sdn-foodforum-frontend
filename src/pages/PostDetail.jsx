import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { MessageCircle, Share, Bookmark, BookmarkCheck, ChevronUp, ChevronDown, ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import postsApi from "../api/posts"
import commentsApi from "../api/comments"
import votesApi from "../api/votes"
import { addToFavorites, removeFromFavorites, getCurrentUser } from "../api/user"
import { useAuth } from "../hooks/useAuth"

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
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null })
  const [voteLoading, setVoteLoading] = useState(false)

  // Load vote data when comment loads
  useEffect(() => {
    const loadVoteData = async () => {
      if (comment._id || comment.id) {
        try {
          const votes = await votesApi.getVotes(comment._id || comment.id)
          setVoteData(votes)
        } catch (error) {
          console.warn('Failed to fetch comment votes:', error)
        }
      }
    }
    loadVoteData()
  }, [comment._id, comment.id])

  // Handle voting on comments
  const handleCommentVote = async (voteType) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setVoteLoading(true)
      const commentId = comment._id || comment.id

      // If user already voted with the same type, remove the vote
      if (voteData.userVote === voteType) {
        await votesApi.removeVote(commentId)
        setVoteData(prev => ({
          ...prev,
          userVote: null,
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: Math.max(0, prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
        }))
        console.log(`Removed ${voteType} from comment`)
      } else {
        // If user voted differently, update the vote
        const oldVoteType = voteData.userVote
        await votesApi.voteOnComment(commentId, voteType)

        setVoteData(prev => {
          let newData = { ...prev, userVote: voteType }

          // Remove old vote count
          if (oldVoteType) {
            newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] = Math.max(0, newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
          }

          // Add new vote count
          newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] = newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] + 1

          return newData
        })
        console.log(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)}d comment`)
      }
    } catch (error) {
      console.error('Error voting on comment:', error)
      // You could add a toast notification here for better UX
    } finally {
      setVoteLoading(false)
    }
  }

  const handleReply = async () => {
    if (replyText.trim()) {
      try {
        // You can implement reply creation here when needed
        console.log('Reply:', replyText)
        setReplyText("")
        setIsReplying(false)
      } catch (error) {
        console.error('Failed to post reply:', error)
      }
    }
  }

  // Format timestamp for display
  const formatCommentTime = (date) => {
    if (!date) return 'Unknown time'
    const now = new Date()
    const commentDate = new Date(date)
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l border-gray-200 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold text-gray-800">
            {comment.user_id?.username || comment.author || 'Unknown User'}
          </span>
          <span className="text-sm text-gray-500">
            {comment.createdAt ? formatCommentTime(comment.createdAt) : comment.timestamp || 'Unknown time'}
          </span>
        </div>
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 transition-all duration-200 ${voteData.userVote === 'upvote'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'hover:bg-orange-100 hover:text-orange-600'
                } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleCommentVote('upvote')}
              disabled={voteLoading}
              title={voteData.userVote === 'upvote' ? 'Remove upvote' : 'Upvote comment'}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <span className={`text-sm font-semibold ${(voteData.upvotes || 0) - (voteData.downvotes || 0) > 0
              ? 'text-orange-600'
              : (voteData.upvotes || 0) - (voteData.downvotes || 0) < 0
                ? 'text-red-500'
                : 'text-gray-600'
              }`}>
              {(voteData.upvotes || 0) - (voteData.downvotes || 0)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 transition-all duration-200 ${voteData.userVote === 'downvote'
                ? 'bg-red-500 text-white shadow-sm'
                : 'hover:bg-red-100 hover:text-red-600'
                } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleCommentVote('downvote')}
              disabled={voteLoading}
              title={voteData.userVote === 'downvote' ? 'Remove downvote' : 'Downvote comment'}
            >
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
            <CommentComponent key={reply._id || reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([])
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null })
  const [isFavorited, setIsFavorited] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const postData = await postsApi.getPostById(id)
        setPost(postData)

        // Fetch comments for the post
        try {
          const commentsData = await commentsApi.getCommentsByPostId(id)
          setComments(commentsData)
        } catch (commentError) {
          console.warn('Failed to fetch comments:', commentError)
        }

        // Fetch vote data for the post
        if (user) {
          try {
            const votes = await votesApi.getVotes(id)
            setVoteData(votes)
          } catch (voteError) {
            console.warn('Failed to fetch votes:', voteError)
          }

          // Check if post is favorited by current user
          try {
            const userData = await getCurrentUser()
            const isFav = userData.user.favoritePost?.includes(id) || false
            setIsFavorited(isFav)
          } catch (favError) {
            console.warn('Failed to fetch favorite status:', favError)
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, user])

  // Handle voting
  const handleVote = async (voteType) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setVoteLoading(true)

      // If user already voted with the same type, remove the vote
      if (voteData.userVote === voteType) {
        await votesApi.removeVote(id)
        setVoteData(prev => ({
          ...prev,
          userVote: null,
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: Math.max(0, prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
        }))
      } else {
        // If user voted differently, update the vote
        const oldVoteType = voteData.userVote
        await votesApi.voteOnPost(id, voteType)

        setVoteData(prev => {
          let newData = { ...prev, userVote: voteType }

          // Remove old vote count
          if (oldVoteType) {
            newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] = Math.max(0, newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
          }

          // Add new vote count
          newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] = newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] + 1

          return newData
        })
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoteLoading(false)
    }
  }

  // Handle favoriting
  const handleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setFavoriteLoading(true)

      if (isFavorited) {
        await removeFromFavorites(id)
        setIsFavorited(false)
      } else {
        await addToFavorites(id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

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

  const handlePostComment = async () => {
    if (newComment.trim()) {
      try {
        const comment = await commentsApi.createComment(id, { content: newComment })
        setComments([comment, ...comments])
        setNewComment("")
        // Update post comment count
        setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }))
      } catch (error) {
        console.error('Failed to post comment:', error)
        // Fallback to local state update if API fails
        const localComment = {
          id: Date.now().toString(),
          user_id: { username: "currentuser" },
          content: newComment,
          createdAt: new Date().toISOString(),
          replies: []
        }
        setComments([localComment, ...comments])
        setNewComment("")
      }
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
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${voteData.userVote === 'upvote' ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 hover:text-white'}`}
                onClick={() => handleVote('upvote')}
                disabled={voteLoading}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-gray-700 text-lg">
                {(voteData.upvotes || 0) - (voteData.downvotes || 0)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${voteData.userVote === 'downvote' ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 hover:text-white'}`}
                onClick={() => handleVote('downvote')}
                disabled={voteLoading}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  {post.category?.subreddit || post.category?.name || 'r/general'}
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
              {/* Display images from both imageUrl (legacy) and images array (new) */}
              {(post.imageUrl || (post.images && post.images.length > 0)) && (
                <div className="mb-6">
                  <img
                    src={post.images && post.images.length > 0 ? post.images[0].url : post.imageUrl}
                    alt="Post image"
                    className="rounded-lg object-cover w-full h-[500px]"
                  />
                  {/* Show indicator if there are multiple images */}
                  {post.images && post.images.length > 1 && (
                    <div className="mt-2 text-sm text-gray-500 text-center">
                      +{post.images.length - 1} more image{post.images.length > 2 ? 's' : ''}
                    </div>
                  )}
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
                <button
                  className={`flex items-center space-x-1 cursor-pointer ${isFavorited ? 'text-orange-500' : 'hover:text-orange-500'}`}
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                >
                  {isFavorited ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  <span>{isFavorited ? 'Favorited' : 'Save'}</span>
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
                <CommentComponent key={comment._id || comment.id} comment={comment} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
