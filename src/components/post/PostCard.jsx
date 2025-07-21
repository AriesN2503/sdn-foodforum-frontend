import { MessageCircle, Share, Bookmark, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router"

export function PostCard({
  id,
  title,
  content,
  author,
  subreddit,
  timestamp,
  votes,
  commentCount,
  imageUrl,
  onCommentClick,
}) {
  const navigate = useNavigate()

  const handlePostClick = () => {
    navigate(`/post/${id}`)
  }

  const handleCommentClick = (e) => {
    e.stopPropagation() 
    onCommentClick(id)
  }

  return (
    <article className="border-b border-gray-200 pb-6">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 cursor-pointer hover:bg-orange-500 hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-gray-700">{votes}</span>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 cursor-pointer hover:bg-orange-500 hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 cursor-pointer" onClick={handlePostClick}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span className="text-orange-500">{subreddit}</span>
            <span>
              Đăng bởi {
                author && typeof author === 'object'
                  ? (typeof author.username === 'string' ? author.username : 'Ẩn danh')
                  : (typeof author === 'string' ? author : 'Ẩn danh')
              }
            </span>
            <span>{timestamp}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 hover:text-orange-600 transition-colors">
            {title}
          </h3>
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Ảnh món ăn"
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
              <span>{commentCount} Bình luận</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer"
            >
              <Share className="h-4 w-4" />
              <span>Chia sẻ</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 hover:text-orange-500 cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
} 