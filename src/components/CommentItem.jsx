import { ChevronUp, ChevronDown, MoreVertical, Edit, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState, useEffect } from "react"
import votesApi from "../api/votes"
import commentsApi from "../api/comments"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "./ui/use-toast"
import { useNavigate } from "react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function CommentItem({
  comment,
  replyingTo,
  replyText,
  onReply,
  onPostReply,
  onCancelReply,
  onReplyTextChange,
  onVote,
  depth = 0,
  postId,
  onCommentAdded
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null })
  const [voteLoading, setVoteLoading] = useState(false)
  const [netVotes, setNetVotes] = useState(comment.votes || 0)
  const [localReplyText, setLocalReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [submittingReply, setSubmittingReply] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content || "")
  const [isDeleting, setIsDeleting] = useState(false)

  // Get user data from localStorage if not available from context
  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem("foodforum_auth")
        if (stored) {
          const userData = JSON.parse(stored).user
          if (userData) {
          }
        }
      } catch (error) {
        console.error('Error retrieving user from localStorage:', error)
      }
    }
  }, [user])

  // Get stored user from localStorage
  const storedUserData = (() => {
    try {
      const stored = localStorage.getItem("foodforum_auth")
      return stored ? JSON.parse(stored).user : null
    } catch (e) {
      console.error('Error parsing stored user data', e)
      return null
    }
  })()

  // Check if current user is the comment owner - using various potential ID formats
  const isCommentOwner = comment && (
    // Check using user from auth context
    (user && (
      // By MongoDB ID
      (comment.user_id && comment.user_id._id && user.id === comment.user_id._id) ||
      // By regular ID field
      (comment.user_id && comment.user_id.id && user.id === comment.user_id.id) ||
      // By direct string comparison
      (comment.user_id && typeof comment.user_id === 'string' && user.id === comment.user_id) ||
      // By userId field
      (comment.userId && user.id === comment.userId) ||
      // By username (direct match)
      (user.username && comment.author && user.username === comment.author) ||
      // By username from user_id object
      (comment.user_id && comment.user_id.username && user.username === comment.user_id.username)
    )) ||
    // Fallback: Check using stored user data from localStorage
    (storedUserData && (
      (comment.user_id && comment.user_id._id && storedUserData.id === comment.user_id._id) ||
      (comment.user_id && comment.user_id.id && storedUserData.id === comment.user_id.id) ||
      (comment.user_id && typeof comment.user_id === 'string' && storedUserData.id === comment.user_id) ||
      (comment.userId && storedUserData.id === comment.userId) ||
      (storedUserData.username && comment.author && storedUserData.username === comment.author) ||
      (comment.user_id && comment.user_id.username && storedUserData.username === comment.user_id.username)
    ))
  )

  // Compact debug console log
  const formatTimestamp = (date) => {
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

  // Handle direct reply 
  const handleLocalReply = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!localReplyText.trim()) return

    try {
      setSubmittingReply(true)

      // If using parent component's reply handler
      if (onPostReply && typeof onPostReply === 'function') {
        await onPostReply(comment.id, localReplyText)
      } else if (postId && comment.id) {
        // Use API directly if parent doesn't provide handlers
        await commentsApi.createComment(postId, {
          content: localReplyText,
          parentId: comment.id
        })

        // Notify parent component about the new comment
        if (onCommentAdded && typeof onCommentAdded === 'function') {
          onCommentAdded()
        }

        toast({
          title: "Reply Posted",
          description: "Your reply has been posted successfully",
        })
      }

      // Reset state
      setLocalReplyText("")
      setIsReplying(false)
    } catch (error) {
      console.error("Error posting reply:", error)
      toast({
        title: "Error",
        description: "Failed to post your reply. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmittingReply(false)
    }
  }

  // Fetch vote data when component mounts
  useEffect(() => {
    const fetchVoteData = async () => {
      if (comment.id && user) {
        try {
          const data = await votesApi.getVotes(comment.id)
          setVoteData(data)
          setNetVotes((data.upvotes || 0) - (data.downvotes || 0))
        } catch (error) {
          console.warn('Failed to fetch vote data:', error)
        }
      }
    }

    fetchVoteData()
  }, [comment.id, user])

  // Update when comment.votes changes (from parent)
  useEffect(() => {
    if (comment.votes !== undefined) {
      setNetVotes(comment.votes)
    }
  }, [comment.votes])

  // Handle voting
  const handleVote = async (voteType) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setVoteLoading(true)

      // If using external vote handler from modal (for synchronization)
      if (onVote) {
        await onVote(comment.id, voteType)

        // Update local vote data
        setVoteData(prev => {
          const oldVoteType = prev.userVote

          if (oldVoteType === voteType) {
            // Removing a vote
            return {
              ...prev,
              userVote: null,
              [voteType === 'upvote' ? 'upvotes' : 'downvotes']: Math.max(0, prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
            }
          } else {
            // Adding or changing a vote
            let newData = { ...prev, userVote: voteType }

            // Remove old vote count if there was a previous vote
            if (oldVoteType) {
              newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] =
                Math.max(0, prev[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
            }

            // Add new vote count
            newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] =
              prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] + 1

            return newData
          }
        })

        // No need to update netVotes as it will come from the comment prop
      } else {
        // If using local vote handling
        // If user already voted with the same type, remove the vote
        if (voteData.userVote === voteType) {
          await votesApi.removeVote(comment.id, 'comment')
          setVoteData(prev => ({
            ...prev,
            userVote: null,
            [voteType === 'upvote' ? 'upvotes' : 'downvotes']: Math.max(0, prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
          }))
          // Update net votes count
          setNetVotes(prev => voteType === 'upvote' ? prev - 1 : prev + 1)

          // Show toast notification
          toast({
            title: "Vote Removed",
            description: `Your ${voteType} has been removed from this comment`,
            variant: "default",
          })
        } else {
          // If user voted differently, update the vote
          const oldVoteType = voteData.userVote
          await votesApi.voteOnComment(comment.id, voteType)

          setVoteData(prev => {
            let newData = { ...prev, userVote: voteType }

            // Remove old vote count if there was a previous vote
            if (oldVoteType) {
              newData[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] = Math.max(0, prev[oldVoteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1)
            }

            // Add new vote count
            newData[voteType === 'upvote' ? 'upvotes' : 'downvotes'] = prev[voteType === 'upvote' ? 'upvotes' : 'downvotes'] + 1

            return newData
          })

          // Show toast notification
          toast({
            title: oldVoteType ? "Vote Changed" : "Vote Added",
            description: `Your ${oldVoteType ? `vote changed to ${voteType}` : voteType} recorded successfully`,
            variant: "default",
          })

          // Update net votes count
          if (oldVoteType) {
            // If changing vote (e.g., from downvote to upvote)
            setNetVotes(prev => voteType === 'upvote' ? prev + 2 : prev - 2)
          } else {
            // If new vote
            setNetVotes(prev => voteType === 'upvote' ? prev + 1 : prev - 1)
          }
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
      // Show error toast notification
      toast({
        title: "Error",
        description: `Failed to record your vote: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setVoteLoading(false)
    }
  }

  // Handle comment update
  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      await commentsApi.updateComment(comment.id, { content: editText })

      // Update the local state
      comment.content = editText

      // Exit editing mode
      setIsEditing(false)

      toast({
        title: "Comment Updated",
        description: "Your comment has been updated successfully",
      })

      // Refresh comments if needed
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Error updating comment:", error)
      toast({
        title: "Error",
        description: "Failed to update your comment. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle comment deletion
  const handleDeleteComment = async () => {
    // Confirm deletion if there are replies
    if (comment.replies && comment.replies.length > 0) {
      const confirmDelete = window.confirm(
        "This comment has replies. Deleting it will also remove all replies. Are you sure you want to delete this comment?"
      );
      if (!confirmDelete) return;
    }

    try {
      setIsDeleting(true)
      await commentsApi.deleteComment(comment.id)

      toast({
        title: "Comment Deleted",
        description: "Your comment and all its replies have been deleted successfully",
      })

      // Refresh comments
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete your comment. Please try again.",
        variant: "destructive"
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* Vote buttons */}
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-6 w-6 transition-all duration-200 ${voteData.userVote === 'upvote'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'hover:bg-orange-100 hover:text-orange-600'
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleVote('upvote')}
            disabled={voteLoading}
            title={voteData.userVote === 'upvote' ? 'Remove upvote' : 'Upvote comment'}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <span className={`text-sm font-medium ${netVotes > 0
            ? 'text-orange-600'
            : netVotes < 0
              ? 'text-red-500'
              : 'text-gray-600'
            }`}>
            {netVotes}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-6 w-6 transition-all duration-200 ${voteData.userVote === 'downvote'
              ? 'bg-red-500 text-white shadow-sm'
              : 'hover:bg-red-100 hover:text-red-600'
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleVote('downvote')}
            disabled={voteLoading}
            title={voteData.userVote === 'downvote' ? 'Remove downvote' : 'Downvote comment'}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        {/* Comment content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 font-medium cursor-pointer">{comment.author || comment.user_id?.username || 'Unknown'}</span>
              <span className="text-gray-500">{comment.timestamp || formatTimestamp(comment.createdAt)}</span>
            </div>

            {/* Dropdown menu for comment owner options (positioned at top right) */}
            {isCommentOwner && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-1 h-6 w-6 rounded-full cursor-pointer"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center text-blue-600 font-medium"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center text-red-600 font-medium"
                    onClick={handleDeleteComment}
                    disabled={isDeleting}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Show edit form if editing */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleUpdateComment}
                  className="bg-orange-500 hover:bg-orange-600 py-2 px-4 cursor-pointer"
                  disabled={!editText.trim()}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className='cursor-pointer'
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800">{comment.content}</p>
          )}

          <div className="flex space-x-2">
            {/* Only show reply button for top-level comments (depth === 0) */}
            {depth === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply ? onReply(comment.id) : setIsReplying(true)}
                className="text-gray-500 hover:text-white hover:bg-orange-600 px-4 py-1 h-auto font-normal cursor-pointer"
              >
                Reply
              </Button>
            )}
          </div>

          {/* External Reply form (from parent component) */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => onReplyTextChange && onReplyTextChange(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={onPostReply}
                  className="bg-orange-500 hover:bg-orange-600 py-2 px-4 cursor-pointer"
                  disabled={!replyText || !replyText.trim()}
                >
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelReply} className='cursor-pointer'>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Local Reply form (when used independently) */}
          {isReplying && !replyingTo && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
              <Textarea
                placeholder="Write a reply..."
                value={localReplyText}
                onChange={(e) => setLocalReplyText(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleLocalReply}
                  className="bg-orange-500 hover:bg-orange-600 py-2 px-4 cursor-pointer"
                  disabled={!localReplyText.trim() || submittingReply}
                >
                  {submittingReply ? 'Posting...' : 'Reply'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false)
                    setLocalReplyText('')
                  }}
                  className='cursor-pointer'
                  disabled={submittingReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Render replies if they exist */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply._id || reply.id}
                  comment={{
                    ...reply,
                    id: reply._id || reply.id,
                    author: reply.user_id?.username || reply.author || 'Unknown User',
                    timestamp: reply.createdAt ? formatTimestamp(reply.createdAt) : reply.timestamp
                  }}
                  depth={depth + 1}
                  postId={postId}
                  onCommentAdded={onCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
