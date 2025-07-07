import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { CommentItem } from "./CommentItem"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export function CommentsModal({
  isOpen,
  onClose,
  comments,
  newComment,
  onNewCommentChange,
  onPostComment,
  replyingTo,
  replyText,
  onReply,
  onPostReply,
  onCancelReply,
  onReplyTextChange,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Comments</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Comment Composition */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button onClick={onPostComment} className="bg-orange-500 hover:bg-orange-600 cursor-pointer" disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replyingTo={replyingTo}
                replyText={replyText}
                onReply={onReply}
                onPostReply={onPostReply}
                onCancelReply={onCancelReply}
                onReplyTextChange={onReplyTextChange}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
