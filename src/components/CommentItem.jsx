import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export function CommentItem({
  comment,
  replyingTo,
  replyText,
  onReply,
  onPostReply,
  onCancelReply,
  onReplyTextChange,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        {/* Vote buttons */}
        <div className="flex flex-col items-center space-y-1">
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <ChevronUp className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium text-gray-600">{comment.votes}</span>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
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
