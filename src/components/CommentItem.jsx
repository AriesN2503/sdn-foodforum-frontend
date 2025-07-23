import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState, useEffect } from "react"
import votesApi from "../api/votes"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../components/ui/use-toast"
import { useNavigate } from "react-router"

export function CommentItem({
  comment,
  replyingTo,
  replyText,
  onReply,
  onPostReply,
  onCancelReply,
  onReplyTextChange,
  onVote,
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null })
  const [voteLoading, setVoteLoading] = useState(false)
  const [netVotes, setNetVotes] = useState(comment.votes || 0)

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
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        {/* Vote buttons */}
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-6 w-6 transition-all duration-200 ${voteData.userVote === 'upvote'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'hover:bg-orange-100 hover:text-orange-600'
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleVote('downvote')}
            disabled={voteLoading}
            title={voteData.userVote === 'downvote' ? 'Remove downvote' : 'Downvote comment'}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        {/* Comment content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-orange-500 font-medium cursor-pointer">{comment.author}</span>
            <span className="text-gray-500">{comment.timestamp}</span>
          </div>

          <p className="text-gray-800">{comment.content}</p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="text-gray-500 hover:text-white hover:bg-orange-600 px-4 py-1 h-auto font-normal cursor-pointer"
          >
            Reply
          </Button>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={onPostReply}
                  className="bg-orange-500 hover:bg-orange-600 py-2 px-4 cursor-pointer"
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelReply} className='cursor-pointer'>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
