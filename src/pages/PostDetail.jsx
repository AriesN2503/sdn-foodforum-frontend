import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown, ArrowLeft, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

// Mock post data - this should match your existing data structure
const postsByCategory = {
  Hot: [
    {
      id: "hot-1",
      title: "🔥 Hot Sourdough Recipe",
      content: "Crispy outside, soft inside! This recipe has been in my family for generations. The secret is the 24-hour fermentation process that gives it that perfect tangy flavor and amazing texture. I've been perfecting this recipe for years and finally feel confident enough to share it with the community.",
      author: "u/hotuser1",
      subreddit: "r/recipes",
      timestamp: "1 hour ago",
      votes: 88,
      commentCount: 12,
      imageUrl: "https://i.pinimg.com/736x/00/2b/c0/002bc0b61e57adc2a74021281c3b4bcd.jpg",
    },
  ],
  New: [
    {
      id: "new-1",
      title: "🆕 Just tried Air Fryer Donuts!",
      content: "It works so well, no oil! I was skeptical at first, but these air fryer donuts turned out amazing. They're fluffy, golden, and you don't feel guilty eating them. The cleanup is also super easy compared to deep frying.",
      author: "u/newbie",
      subreddit: "r/foodhacks",
      timestamp: "10 mins ago",
      votes: 2,
      commentCount: 0,
      imageUrl: "https://i.pinimg.com/736x/52/ce/36/52ce36e9f8648dcfd7f5f4d0d7e46939.jpg",
    },
  ],
  Top: [
    {
      id: "top-1",
      title: "🏆 All-Time Best Mac & Cheese",
      content: "Grandma's classic recipe. Worth a try! This recipe uses a combination of sharp cheddar, gruyere, and a touch of cream cheese for the ultimate creamy texture. The breadcrumb topping adds the perfect crunch.",
      author: "u/chefpro",
      subreddit: "r/comfortfood",
      timestamp: "2 days ago",
      votes: 213,
      commentCount: 30,
    },
  ],
}

// Flatten all posts for easier lookup
const allPosts = Object.values(postsByCategory).flat().reduce((acc, post) => {
  acc[post.id] = post
  return acc
}, {})

// Mock comments
const mockComments = [
  {
    id: "1",
    author: "u/foodlover123",
    content: "This looks absolutely delicious! Could you share the exact measurements for the starter?",
    timestamp: "45 minutes ago",
    votes: 12,
    replies: [
      {
        id: "1-1",
        author: "u/hotuser1",
        content: "Sure! I use 100g starter, 500g flour, and 375g water. Let me know if you need more details!",
        timestamp: "30 minutes ago",
        votes: 8,
        replies: []
      }
    ]
  },
  {
    id: "2",
    author: "u/bakingpro",
    content: "The crust looks perfect! What temperature do you bake at?",
    timestamp: "1 hour ago",
    votes: 8,
    replies: []
  },
  {
    id: "3",
    author: "u/sourdoughfan",
    content: "Been making sourdough for 5 years and this technique is spot on. Great post!",
    timestamp: "2 hours ago",
    votes: 15,
    replies: []
  },
]

function CommentComponent({ comment, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Posting reply:", replyText)
      setReplyText("")
      setIsReplying(false)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex flex-col items-center space-y-1">
          <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
            <ChevronUp className="h-3 w-3" />
          </Button>
          <span className="text-xs font-medium text-gray-600">{comment.votes}</span>
          <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <User className="h-4 w-4" />
            <span className="font-medium text-orange-500">{comment.author}</span>
            <span>{comment.timestamp}</span>
          </div>
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

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
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
  const [comments, setComments] = useState(mockComments)

  const post = allPosts[id]

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
            <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
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
              <span className="font-semibold text-gray-700 text-lg">{post.votes}</span>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  {post.subreddit}
                </Badge>
                <span className="text-sm text-gray-500">Posted by {post.author}</span>
                <span className="text-sm text-gray-500">{post.timestamp}</span>
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
                  <span>{post.commentCount} Comments</span>
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
