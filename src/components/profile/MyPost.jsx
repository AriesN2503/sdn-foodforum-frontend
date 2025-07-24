import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getPostById, updatePost, deletePost } from "../../api/post";
import ConfirmationModal from "../admin/ConfirmationModal";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import postsApi from '../../api/posts';

export default function MyPost({ userId, navigate }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPost, setDeletingPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserPosts() {
            setLoading(true);
            try {
                const userPosts = await postsApi.getUserPosts(userId);
                setPosts(userPosts.posts || []);
            } catch (err) {
                setError('Không thể tải bài viết của bạn');
            } finally {
                setLoading(false);
            }
        }
        if (userId) fetchUserPosts();
    }, [userId]);

    const activePosts = posts.filter(post => post.status === 'active' || post.status === 'approved');
    const pendingPosts = posts.filter(post => post.status === 'pending');
    const rejectedPosts = posts.filter(post => post.status === 'rejected');

    const handleCardClick = async (postId) => {
        setLoadingDetail(true);
        setError(null);
        try {
            const res = await getPostById(postId);
            setSelectedPost(res.data || res);
            setModalOpen(true);
        } catch (err) {
            setError("Failed to load post details");
        } finally {
            setLoadingDetail(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPost(null);
        setError(null);
    };

    // Edit logic
    const openEditModal = (post) => {
        setEditingPost({ ...post });
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingPost(null);
    };
    const handleEditChange = (field, value) => {
        setEditingPost(prev => ({ ...prev, [field]: value }));
    };
    const handleSaveEdit = async () => {
        if (!editingPost) return;
        setSaving(true);
        try {
            const updated = await updatePost(editingPost._id || editingPost.id, editingPost);
            setPosts(prev => prev.map(post => (post._id === updated._id ? updated : post)));
            closeEditModal();
        } catch (err) {
            setError("Failed to update post.");
        } finally {
            setSaving(false);
        }
    };

    // Delete logic
    const openDeleteModal = (post) => {
        setDeletingPost(post);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingPost(null);
    };
    const handleDeletePost = async () => {
        if (!deletingPost) return;
        try {
            await deletePost(deletingPost._id || deletingPost.id);
            setPosts(prev => prev.filter(p => (p._id || p.id) !== (deletingPost._id || deletingPost.id)));
            closeDeleteModal();
        } catch (err) {
            setError("Failed to delete post.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bài Viết Của Tôi</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-orange-500">Đang tải bài viết...</div>
                ) : (
                  <>
                    {/* Pending Posts */}
                    {pendingPosts.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-orange-500 mb-2">Bài viết chờ duyệt</h3>
                        <div className="space-y-4">
                          {pendingPosts.map((post) => (
                            <Card key={post._id} className="border border-yellow-300 bg-yellow-50 cursor-pointer group">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {(post.image && post.image.length > 0) && (
                                    <img
                                      src={post.image[0]}
                                      alt={post.title}
                                      className="w-40 h-40 object-cover rounded-lg border border-yellow-200 mb-4 md:mb-0"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-semibold">Chờ duyệt</span>
                                      <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-800 mb-2" onClick={() => handleCardClick(post._id)}>{post.title}</h3>
                                    <p className="text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Active/Approved Posts */}
                    {activePosts.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Bài viết đã duyệt</h3>
                        <div className="space-y-4">
                          {activePosts.map((post) => (
                            <Card key={post._id} className="border border-green-300 bg-green-50 cursor-pointer group">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {(post.image && post.image.length > 0) && (
                                    <img
                                      src={post.image[0]}
                                      alt={post.title}
                                      className="w-40 h-40 object-cover rounded-lg border border-green-200 mb-4 md:mb-0"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">Đã duyệt</span>
                                      <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2" onClick={() => handleCardClick(post._id)}>{post.title}</h3>
                                    <p className="text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Rejected Posts */}
                    {rejectedPosts.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Bài viết bị từ chối</h3>
                        <div className="space-y-4">
                          {rejectedPosts.map((post) => (
                            <Card key={post._id} className="border border-red-300 bg-red-50 cursor-pointer group">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {(post.image && post.image.length > 0) && (
                                    <img
                                      src={post.image[0]}
                                      alt={post.title}
                                      className="w-40 h-40 object-cover rounded-lg border border-red-200 mb-4 md:mb-0"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-semibold">Bị từ chối</span>
                                      <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-red-800 mb-2" onClick={() => handleCardClick(post._id)}>{post.title}</h3>
                                    <p className="text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Modal for post detail */}
                {modalOpen && selectedPost && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative border-2 border-orange-500">
                            <button onClick={closeModal} className="absolute top-3 right-3 text-orange-500 hover:text-orange-700 text-2xl font-bold">&times;</button>
                            {loadingDetail ? (
                                <div className="text-center py-8 text-orange-500">Loading...</div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">{error}</div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-orange-600 mb-4">{selectedPost.title}</h2>
                                    {(selectedPost.image && selectedPost.image.length > 0) && (
                                        <img
                                            src={selectedPost.image[0]}
                                            alt={selectedPost.title}
                                            className="w-full h-64 object-cover rounded-lg mb-4 border border-orange-100"
                                        />
                                    )}
                                    <div className="mb-2 text-gray-700"><span className="font-semibold text-orange-500">Content:</span> {selectedPost.content}</div>
                                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-orange-500">Tags:</span> {selectedPost.tags.join(", ")}
                                        </div>
                                    )}
                                    {selectedPost.ingredients && selectedPost.ingredients.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-orange-500">Ingredients:</span> {selectedPost.ingredients.join(", ")}
                                        </div>
                                    )}
                                    {selectedPost.instructions && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-orange-500">Instructions:</span> {selectedPost.instructions}
                                        </div>
                                    )}
                                    <div className="flex gap-4 mt-4 text-sm text-gray-500">
                                        <span>Status: <span className="text-orange-600 font-semibold">{selectedPost.status}</span></span>
                                        <span>Views: {selectedPost.views}</span>
                                        <span>Created: {new Date(selectedPost.createdAt).toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingPost && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                            <h2 className="text-xl font-semibold">Edit Post</h2>
                            <div>
                                <label className="block text-sm mb-1">Title</label>
                                <Input
                                    value={editingPost.title}
                                    onChange={e => handleEditChange('title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Content</label>
                                <Textarea
                                    value={editingPost.content}
                                    onChange={e => handleEditChange('content', e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    open={showDeleteModal && !!deletingPost}
                    title="Confirm Deletion"
                    message={deletingPost ? `Are you sure you want to delete post '${deletingPost.title}'? This action cannot be undone.` : ''}
                    onConfirm={handleDeletePost}
                    onCancel={closeDeleteModal}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </CardContent>
        </Card>
    );
} 