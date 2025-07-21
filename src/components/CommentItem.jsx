import { useState } from 'react';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, onReply, replyingTo, onSubmitReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    setShowReplyForm(true);
    onReply(comment._id);
  };

  const handleCancel = () => {
    setShowReplyForm(false);
    onReply(null);
  };

  return (
    <div className="border-b border-gray-100 py-2 pl-2">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <span className="font-semibold">{comment.commenter?.username || 'Ẩn danh'}</span>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
      </div>
      <div className="mb-2 text-gray-800">{comment.content}</div>
      <div className="flex gap-2 mb-1">
        <button className="text-xs text-orange-500 hover:underline" onClick={handleReply}>
          Trả lời
        </button>
      </div>
      {showReplyForm && replyingTo === comment._id && (
        <CommentForm
          onSubmit={content => onSubmitReply(content, comment._id)}
          onCancel={handleCancel}
          placeholder="Trả lời bình luận..."
        />
      )}
      {/* Render replies (children) nếu có */}
      {comment.children && comment.children.length > 0 && (
        <div className="pl-4 border-l border-gray-100 mt-2">
          {comment.children.map(child => (
            <CommentItem
              key={child._id}
              comment={child}
              onReply={onReply}
              replyingTo={replyingTo}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
