import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import postsApi from '../../api/posts';
import { useToast } from "../../context/ToastContext"
import CreatePostForm from "../post/CreatePostForm";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router";

export default function PostManagement() {
    const [posts, setPosts] = useState([])
    const [editingPost, setEditingPost] = useState(null)
    const [deletingPost, setDeletingPost] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all | pending | approved | rejected
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const limit = 10;
    const { showToast } = useToast()
    const navigate = useNavigate();

    const fetchPostData = async (pageNum = 1) => {
        try {
            const res = await postsApi.getAllPosts({ allStatus: true, page: pageNum, limit });
            setPosts(res.posts || res.data || res);
            setTotalPages(
              res.pagination?.totalPages ||
              res.totalPages ||
              Math.ceil((res.total || (res.posts?.length || 0)) / limit) ||
              1
            );
            setTotalPosts(res.pagination?.totalPosts || res.totalPosts || 0);
        } catch {
            // silent
        }
    }

    useEffect(() => {
        fetchPostData(page)
    }, [page])

    // Approve/Reject logic
    const handleApprove = async (postId) => {
        try {
            await postsApi.approvePost(postId);
            showToast('Bài viết đã được duyệt!', { type: 'success' });
            fetchPostData(page);
        } catch (err) {
            showToast('Duyệt bài viết thất bại!', { type: 'error' });
        }
    };
    const handleReject = async (postId) => {
        try {
            await postsApi.rejectPost(postId);
            showToast('Bài viết đã bị từ chối!', { type: 'success' });
            fetchPostData(page);
        } catch (err) {
            showToast('Từ chối bài viết thất bại!', { type: 'error' });
        }
    };

    // Filter posts
    const filteredPosts = posts.filter(post => {
        if (filter === 'all') return true;
        return post.status === filter;
    });


    const handleDeletePost = async () => {
        if (!deletingPost) return;
        try {
            await postsApi.deletePost(deletingPost._id || deletingPost.id)
            setPosts((prev) => prev.filter(p => (p._id || p.id) !== (deletingPost._id || deletingPost.id)))
            showToast("Post deleted successfully!", { type: "success" })
        } catch {
            showToast("Failed to delete post.", { type: "error" })
        } finally {
            setDeletingPost(null)
            setShowDeleteModal(false)
        }
    }

    const handleSaveEditPost = async () => {
        if (!editingPost) return;
        try {
            const updated = await postsApi.updatePost(editingPost._id || editingPost.id, editingPost)
            setPosts(prev => prev.map(post => (post._id === updated._id ? updated : post)))
            setEditingPost(null)
            showToast("Post updated successfully!", { type: "success" })
        } catch {
            showToast("Failed to update post.", { type: "error" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Posts Management</h2>
                <div className="flex gap-2">
                  <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => { setFilter('all'); setPage(1); }}>Tất cả</Button>
                  <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => { setFilter('pending'); setPage(1); }}>Chờ duyệt</Button>
                  <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => { setFilter('approved'); setPage(1); }}>Đã duyệt</Button>
                  <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => { setFilter('rejected'); setPage(1); }}>Bị từ chối</Button>
                </div>
            </div>

            {/* Tổng số bài post */}
            <div className="mb-2 text-right text-gray-600 text-sm">
              Tổng số bài post: {totalPosts !== undefined ? totalPosts : posts.length}
            </div>

            {/* Table danh sách bài post */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b">Tiêu đề</th>
                    <th className="px-4 py-2 border-b">Tác giả</th>
                    <th className="px-4 py-2 border-b">Trạng thái</th>
                    <th className="px-4 py-2 border-b">Ngày tạo</th>
                    <th className="px-4 py-2 border-b">Lượt thích</th>
                    <th className="px-4 py-2 border-b">Bình luận</th>
                    <th className="px-4 py-2 border-b">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post._id || post.id} className="border-b hover:bg-orange-50 cursor-pointer" onClick={() => navigate(`/admin/posts/${post._id || post.id}`)}>
                      <td className="px-4 py-2 max-w-xs truncate font-semibold">{post.title}</td>
                      <td className="px-4 py-2">{post.author?.username || post.author || 'Unknown'}</td>
                      <td className="px-4 py-2">
                        <span className="text-xs px-2 py-1 rounded-full font-semibold"
                          style={{ background: post.status === 'pending' ? '#FEF08A' : post.status === 'approved' ? '#BBF7D0' : '#FECACA', color: post.status === 'pending' ? '#92400E' : post.status === 'approved' ? '#166534' : '#991B1B' }}>
                          {post.status === 'pending' ? 'Chờ duyệt' : post.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2">{post.likes || post.votes || 0}</td>
                      <td className="px-4 py-2">{post.comments || post.commentCount || 0}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-2 items-end">
                          {post.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white mb-1" onClick={() => handleApprove(post._id || post.id)}>Duyệt</Button>
                              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleReject(post._id || post.id)}>Từ chối</Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setEditingPost(post)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setDeletingPost(post); setShowDeleteModal(true); }}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Trước</Button>
              <span>Trang {page} / {totalPages}</span>
              <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sau</Button>
            </div>
            {editingPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold">Edit Post</h2>
                        <div>
                            <label className="block text-sm mb-1">Title</label>
                            <Input
                                value={editingPost.title}
                                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Content</label>
                            <Textarea
                                value={editingPost.content}
                                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveEditPost}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmationModal
                open={showDeleteModal && !!deletingPost}
                title="Confirm Deletion"
                message={deletingPost ? `Are you sure you want to delete post '${deletingPost.title}'? This action cannot be undone.` : ''}
                onConfirm={handleDeletePost}
                onCancel={() => { setShowDeleteModal(false); setDeletingPost(null); }}
                confirmText="Delete"
                cancelText="Cancel"
            />
            {/* Đã xoá nút và modal tạo post */}
        </div>
    )
}
