import { useEffect, useState } from 'react';
import { getComments, createComment } from '../api/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getComments(postId);
      setComments(res.data.comments);
    } catch (err) {
      setError('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleSubmit = async (content, parentId = null) => {
    setPosting(true);
    try {
      await createComment(postId, content, parentId);
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      alert('Không thể gửi bình luận');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-6 shadow">
      <h3 className="font-semibold text-lg mb-4">Bình luận</h3>
      <CommentForm onSubmit={content => handleSubmit(content)} loading={posting && !replyingTo} />
      {loading ? (
        <div className="text-gray-400 text-center py-8">Đang tải bình luận...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400 text-center py-8">Chưa có bình luận nào</div>
      ) : (
        <div className="mt-4">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={setReplyingTo}
              replyingTo={replyingTo}
              onSubmitReply={handleSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
} 