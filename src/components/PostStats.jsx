import { Eye, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"

export default function PostStats({ 
    viewsCount = 0, 
    upvotes = [], 
    downvotes = [], 
    commentCount = 0,
    showLabels = true,
    className = "" 
}) {
    const upvoteCount = upvotes.length
    const downvoteCount = downvotes.length

    return (
        <div className={`flex items-center space-x-4 text-sm text-gray-500 ${className}`}>
            {/* Views */}
            <div className="flex items-center space-x-1" title={`${viewsCount} lượt xem`}>
                <Eye className="h-4 w-4" />
                {showLabels && <span>{viewsCount}</span>}
            </div>
            
            {/* Upvotes */}
            <div className="flex items-center space-x-1" title={`${upvoteCount} thích`}>
                <ThumbsUp className="h-4 w-4 text-green-500" />
                {showLabels && <span>{upvoteCount}</span>}
            </div>
            
            {/* Downvotes */}
            <div className="flex items-center space-x-1" title={`${downvoteCount} không thích`}>
                <ThumbsDown className="h-4 w-4 text-red-500" />
                {showLabels && <span>{downvoteCount}</span>}
            </div>
            
            {/* Comments */}
            <div className="flex items-center space-x-1" title={`${commentCount} bình luận`}>
                <MessageCircle className="h-4 w-4" />
                {showLabels && <span>{commentCount}</span>}
            </div>
        </div>
    )
} 