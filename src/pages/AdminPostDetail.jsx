import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import postsApi from "../api/posts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Input } from "../components/ui/input";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function AdminPostDetail() {
    console.log("AdminPostDetail mounted");
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { showToast } = useToast();
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await postsApi.getPostById(id);
                setPost(data);
            } catch {
                setError("Không tìm thấy bài viết hoặc có lỗi xảy ra.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // Thêm hàm duyệt và từ chối
    const handleApprove = async () => {
        try {
            await postsApi.approvePost(post._id || post.id);
            showToast("Bài viết đã được duyệt!", { type: "success" });
            // Reload lại post
            const data = await postsApi.getPostById(id);
            setPost(data);
        } catch {
            showToast("Duyệt bài viết thất bại!", { type: "error" });
        }
    };
    const handleReject = async () => {
        setShowRejectModal(true);
    };
    const handleConfirmReject = async () => {
        try {
            await postsApi.rejectPost(post._id || post.id, rejectReason);
            showToast("Bài viết đã bị từ chối!", { type: "success" });
            setShowRejectModal(false);
            setRejectReason("");
            // Reload lại post
            const data = await postsApi.getPostById(id);
            setPost(data);
        } catch {
            showToast("Từ chối bài viết thất bại!", { type: "error" });
        }
    };

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
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/admin/posts">
                        <Button variant="outline">
                            <Home className="w-4 h-4 mr-2" />
                            Về danh sách bài viết
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy bài viết</h2>
                    <Link to="/admin/posts">
                        <Button variant="outline">
                            <Home className="w-4 h-4 mr-2" />
                            Về danh sách bài viết
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Về danh sách bài viết</span>
                    </Button>
                </Link>
            </div>
            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex flex-col items-end mb-4 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                            {post.author?.profilePicture && (
                                <img src={post.author.profilePicture} alt={post.author.username} className="w-8 h-8 rounded-full object-cover border" />
                            )}
                            <span className="font-medium text-gray-700">{post.author?.username || "Ẩn danh"}</span>
                        </div>
                        <span className="text-xs text-gray-500">Đăng ngày {formatDate(post.createdAt)}</span>
                        <span className="text-xs px-2 py-1 rounded-full font-semibold mt-2"
                            style={{ background: post.status === 'pending' ? '#FEF08A' : post.status === 'approved' ? '#BBF7D0' : '#FECACA', color: post.status === 'pending' ? '#92400E' : post.status === 'approved' ? '#166534' : '#991B1B' }}>
                            {post.status === 'pending' ? 'Chờ duyệt' : post.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối'}
                        </span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-[#FF6900] text-center mb-4">{post.title}</CardTitle>
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
                        {post.status === 'rejected' && post.rejectedReason && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded w-full max-w-xl">
                                <h4 className="text-lg font-semibold text-red-700 mb-1">Lý do từ chối</h4>
                                <div className="text-gray-700">{post.rejectedReason}</div>
                            </div>
                        )}
                        {post.thumbnailUrl && <img src={post.thumbnailUrl} alt={post.title} className="rounded-2xl w-full max-w-xl object-cover mb-4 shadow" />}
                        <div className="text-lg text-gray-700 mb-4 mt-2 text-center font-medium">{post.description}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2 justify-center">
                            <span>⏱️ <b>Chuẩn bị:</b> {post.prepTimeMinutes} phút</span>
                            <span>🍳 <b>Nấu:</b> {post.cookTimeMinutes} phút</span>
                            <span>👨‍👩‍👧‍👦 <b>Khẩu phần:</b> {post.servings}</span>
                        </div>
                    </div>
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
                    {post.notes && (
                        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <h4 className="text-lg font-semibold text-yellow-700 mb-1">Ghi chú</h4>
                            <div className="text-gray-700">{post.notes}</div>
                        </div>
                    )}
                    {post.status === 'pending' && (
                        <div className="flex gap-4 justify-end mt-4">
                            <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleApprove}>Duyệt</Button>
                            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleReject}>Từ chối</Button>
                        </div>
                    )}
                    {/* Modal nhập lý do từ chối */}
                    <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                        <DialogContent className="max-w-md">
                            <div className="mb-2 font-semibold">Lý do từ chối (không bắt buộc):</div>
                            <Input
                                placeholder="Nhập lý do từ chối (tuỳ chọn)"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowRejectModal(false)}>Huỷ</Button>
                                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmReject}>Xác nhận từ chối</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
} 