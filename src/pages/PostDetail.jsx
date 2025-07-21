import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { getPostById } from "../api/post"
import { CommentItem } from "../components/CommentItem"
import Header from "../components/Header"

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Bình luận (có thể fetch từ API nếu có, tạm thời để mảng rỗng)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    getPostById(id)
      .then(res => {
        setPost(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Không tìm thấy bài viết hoặc có lỗi xảy ra.")
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-lg text-gray-500">Đang tải bài viết...</div>
    )
  }
  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
            <p className="text-gray-600 mb-6">Bài viết bạn tìm không tồn tại hoặc đã bị xóa.</p>
            <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 text-white !cursor-pointer">
              Quay về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Xử lý dữ liệu bài viết
  const {
    title,
    content,
    image,
    tags = [],
    ingredients = [],
    instructions,
    author,
    views,
    createdAt,
    votes = 0,
    commentCount = 0,
  } = post

  // Xử lý ảnh (có thể là mảng hoặc 1 url)
  const images = Array.isArray(image) ? image : image ? [image] : []

  // Xử lý tên tác giả
  const authorName = author && typeof author === 'object'
    ? (typeof author.username === 'string' ? author.username : 'Ẩn danh')
    : (typeof author === 'string' ? author : 'Ẩn danh')

  // Xử lý ngày đăng
  const dateStr = createdAt ? new Date(createdAt).toLocaleString('vi-VN') : ''

  // Thêm bình luận mới (UI demo, chưa gọi API)
  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: authorName,
        content: newComment,
        timestamp: 'Vừa xong',
        votes: 0,
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
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Nút quay lại */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-4 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay về danh sách
        </Button>

        {/* Nội dung bài viết */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:space-x-6">
              {/* Ảnh lớn */}
              {images.length > 0 && (
                <div className="mb-6 md:mb-0 md:w-2/5 w-full flex flex-col gap-3">
                  {images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Ảnh món ăn ${idx + 1}`}
                      className="rounded-lg object-cover w-full max-h-[350px] border border-orange-100 shadow"
                    />
                  ))}
                </div>
              )}
              {/* Thông tin bài viết */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-orange-500 border-orange-500 px-3 py-1 text-sm">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Đăng bởi <span className="text-orange-500 font-semibold">{authorName}</span></span>
                  {dateStr && <span>• {dateStr}</span>}
                  {typeof views === 'number' && <span>• {views} lượt xem</span>}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-gray-700 text-lg">{votes}</span>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-500 hover:text-white">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <span className="text-gray-500">• {commentCount} bình luận</span>
                </div>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">Mô tả</h2>
                <p className="text-gray-700 text-base mb-4 whitespace-pre-line">{content}</p>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">Nguyên liệu</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  {ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">Hướng dẫn</h2>
                <p className="text-gray-700 text-base whitespace-pre-line">{instructions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bình luận */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bình luận</h2>
            {/* Thêm bình luận */}
            <div className="mb-8">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Bạn nghĩ gì về bài viết này?"
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handlePostComment}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newComment.trim()}
                >
                  Đăng bình luận
                </Button>
              </div>
            </div>
            {/* Danh sách bình luận */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              ) : (
                comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
