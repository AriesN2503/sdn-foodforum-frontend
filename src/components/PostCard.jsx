import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import votesApi from "../api/votes"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../components/ui/use-toast"

export function PostCard({
  id,
  title,
  content,
  author,
  subreddit,
  timestamp,
  votes: initialVotes = 0,
  commentCount,
  imageUrl, // Keep for backward compatibility
  images, // New images array
  onCommentClick,
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null })
  const [voteLoading, setVoteLoading] = useState(false)
  const [netVotes, setNetVotes] = useState(initialVotes)

  // Fetch vote data when component mounts
  useEffect(() => {
    const fetchVoteData = async () => {
      if (id && user) {
        try {
          const data = await votesApi.getVotes(id)
          setVoteData(data)
          setNetVotes((data.upvotes || 0) - (data.downvotes || 0))
        } catch (error) {
          console.warn('Failed to fetch vote data:', error)
        }
      }
    }

    fetchVoteData()
  }, [id, user])

  const handlePostClick = () => {
    navigate(`/post/${id}`)
  }

  const handleCommentClick = (e) => {
    e.stopPropagation()
    onCommentClick(id)
  }

  // Handle voting
  const handleVote = async (e, voteType) => {
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    try {
      setVoteLoading(true)

      // If user already voted with the same type, remove the vote
      if (voteData.userVote === voteType) {
        await votesApi.removeVote(id, 'post')
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
          description: `Your ${voteType} has been removed`,
          variant: "default",
        })
      } else {
        // If user voted differently, update the vote
        const oldVoteType = voteData.userVote
        await votesApi.voteOnPost(id, voteType)

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
    <article className="border-b border-gray-200 pb-6">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 cursor-pointer transition-all duration-200 ${voteData.userVote === 'upvote'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'hover:bg-orange-100 hover:text-orange-600'
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => handleVote(e, 'upvote')}
            disabled={voteLoading}
            title={voteData.userVote === 'upvote' ? 'Remove upvote' : 'Upvote post'}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <span className={`font-semibold ${netVotes > 0
            ? 'text-orange-600'
            : netVotes < 0
              ? 'text-red-500'
              : 'text-gray-700'
            }`}>
            {netVotes}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 cursor-pointer transition-all duration-200 ${voteData.userVote === 'downvote'
              ? 'bg-red-500 text-white shadow-sm'
              : 'hover:bg-red-100 hover:text-red-600'
              } ${voteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => handleVote(e, 'downvote')}
            disabled={voteLoading}
            title={voteData.userVote === 'downvote' ? 'Remove downvote' : 'Downvote post'}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 cursor-pointer" onClick={handlePostClick}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span className="text-orange-500">{subreddit}</span>
            <span>Posted by {author}</span>
            <span>{timestamp}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 hover:text-orange-600 transition-colors">
            {title}
          </h3>
          {(imageUrl || (images && images.length > 0)) && (
            <div className="mb-4">
              <img
                src={images && images.length > 0 ? images[0].url : imageUrl}
                alt="Post image"
                width={200}
                height={120}
                className="rounded-lg object-cover w-full h-[400px]"
              />
            </div>
          )}
          <p className="text-gray-600 mb-4">{content}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount} Comments</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}