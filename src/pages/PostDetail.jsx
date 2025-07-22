import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import postsApi from "../api/posts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ArrowLeft, Home, ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "../context/ToastContext"
import PostStats from "../components/PostStats"
import CommentsSection from '../components/CommentsSection';
import { upvotePost, downvotePost } from '../api/votes';

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function PostDetail() {
    // State cho vote
    const [upvotesCount, setUpvotesCount] = useState(0);
    const [downvotesCount, setDownvotesCount] = useState(0);
    const [userVote, setUserVote] = useState(null); // 'upvote' | 'downvote' | null
    const [loadingVote, setLoadingVote] = useState(false);
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await postsApi.getPostBySlug(slug);
                setPost(data);
                setUpvotesCount(data.upvotes?.length || 0);
                setDownvotesCount(data.downvotes?.length || 0);
                // Nếu backend trả về trạng thái vote của user, setUserVote(data.userVote)
            } catch {
                setError("Không tìm thấy bài viết hoặc có lỗi xảy ra.");
      } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleUpvote = async () => {
        if (loadingVote || !post?._id) return;
        setLoadingVote(true);
        try {
            const res = await upvotePost(post._id);
            setUpvotesCount(res.data.upvotes);
            setDownvotesCount(res.data.downvotes);
            setUserVote(res.data.userVote || (userVote === "upvote" ? null : "upvote"));
        } finally {
            setLoadingVote(false);
        }
    };

    const handleDownvote = async () => {
        if (loadingVote || !post?._id) return;
        setLoadingVote(true);
        try {
            const res = await downvotePost(post._id);
            setUpvotesCount(res.data.upvotes);
            setDownvotesCount(res.data.downvotes);
            setUserVote(res.data.userVote || (userVote === "downvote" ? null : "downvote"));
        } finally {
            setLoadingVote(false);
        }
    };

    console.log('post', post)

  if (loading) {
    return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
      </div>
    )
  }

    if (error) {
    return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/posts/all">
                        <Button variant="outline">
                            <Home className="w-4 h-4 mr-2" />
                            Về tất cả bài viết
            </Button>
                    </Link>
                </div>
      </div>
    )
  }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy bài viết</h2>
                    <Link to="/posts/all">
                        <Button variant="outline">
                            <Home className="w-4 h-4 mr-2" />
                            Về tất cả bài viết
                        </Button>
                    </Link>
                </div>
            </div>
        )
  }

  return (
        <div className="container mx-auto px-4 py-8">
            {/* Icon điều hướng về trang tất cả bài viết */}
            <div className="mb-6">
                <Link to="/posts/all">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Về tất cả bài viết</span>
      </Button>
                </Link>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    {/* Tác giả và ngày đăng */}
                    <div className="flex flex-col items-end mb-4 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                            {post.author?.profilePicture && (
                                <img src={post.author.profilePicture} alt={post.author.username} className="w-8 h-8 rounded-full object-cover border" />
                            )}
                            <span className="font-medium text-gray-700">{post.author?.username || "Ẩn danh"}</span>
              </div>
                        <span className="text-xs text-gray-500">Đăng ngày {formatDate(post.createdAt)}</span>
                    </div>

                    <CardTitle className="text-3xl font-bold text-[#FF6900] text-center mb-4">{post.title}</CardTitle>

                    {/* Danh mục */}
                    <div className="flex flex-wrap gap-2 justify-center ">
                        {post.categories && post.categories.map((cat) => (
                            <Badge key={cat._id} variant="outline" className="flex items-center gap-1 border border-orange-200 bg-orange-50 px-2 py-1">

                                <span className="text-orange-700 font-medium">{cat.name}</span>
                            </Badge>
                        ))}
                </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-6">
                        {post.thumbnailUrl && <img src={post.thumbnailUrl} alt={post.title} className="rounded-2xl w-full max-w-xl object-cover mb-4 shadow" />}
                        <div className="text-lg text-gray-700 mb-4 mt-2 text-center font-medium">{post.description}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2 justify-center">
                            <span>⏱️ <b>Chuẩn bị:</b> {post.prepTimeMinutes} phút</span>
                            <span>🍳 <b>Nấu:</b> {post.cookTimeMinutes} phút</span>
                            <span>👨‍👩‍👧‍👦 <b>Khẩu phần:</b> {post.servings}</span>
                </div>
                        
                        {/* Thống kê bài viết + Vote */}
                        <div className="mt-4 flex items-center gap-6 justify-center">
                            <PostStats 
                                viewsCount={post.viewsCount || 0}
                                upvotes={post.upvotes || []}
                                downvotes={post.downvotes || []}
                                commentCount={post.comments?.length || 0}
                                className="justify-center"
                            />
                        </div>
            </div>

                    {/* Nguyên liệu */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-600 mb-3">Nguyên liệu</h3>
                        <ul className="space-y-3">
                            {post.ingredients && post.ingredients.map((ing, idx) => (
                                <li key={ing._id || idx} className="flex items-center gap-3 bg-orange-50 rounded-lg px-3 py-2">
                                    {ing.imageUrl && <img src={ing.imageUrl} alt={ing.name} className="w-10 h-10 object-cover rounded-lg border" />}
                                    <span className="font-medium text-gray-800">{ing.name}</span>
                                    <span className="text-gray-500">({ing.quantity})</span>
                                </li>
                            ))}
                        </ul>
          </div>

                    {/* Hướng dẫn */}
          <div className="mb-8">
                        <h3 className="text-xl font-semibold text-orange-600 mb-3">Hướng dẫn</h3>
                        <ol className="space-y-6">
                            {post.instructions && post.instructions.map((ins, idx) => (
                                <li key={ins._id || idx} className="flex gap-4 items-start bg-gray-50 rounded-lg px-3 py-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mt-1 shadow">{ins.stepNumber}</span>
                                    <div className="flex-1">
                                        <div className="text-gray-800 mb-2 font-medium">{ins.stepDescription}</div>
                                        {ins.imageUrl && <img src={ins.imageUrl} alt={"Bước " + ins.stepNumber} className="w-40 h-28 object-cover rounded-lg border" />}
            </div>
                                </li>
                            ))}
                        </ol>
          </div>

                    {/* Ghi chú */}
                    {post.notes && (
                        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <h4 className="text-lg font-semibold text-yellow-700 mb-1">Ghi chú</h4>
                            <div className="text-gray-700">{post.notes}</div>
                        </div>
                    )}
        </CardContent>
      </Card>
        {/* Bình luận */}
        {post._id && <CommentsSection postId={post._id} />}
    </div>
  )
}
