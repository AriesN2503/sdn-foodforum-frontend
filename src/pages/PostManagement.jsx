import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { getPosts, deletePost, updatePost } from "../api/post"
import { useToast } from "../context/ToastContext"

export default function PostManagement() {
    const [posts, setPosts] = useState([])
    const [editingPost, setEditingPost] = useState(null)
    const [deletingPost, setDeletingPost] = useState(null)
    const { showToast } = useToast()

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const res = await getPosts()
                setPosts(res.data || res)
            } catch (err) {
                console.error("Failed to fetch posts", err)
            }
        }
        fetchPostData()
    }, [])

    const handleDeletePost = async () => {
        if (!deletingPost) return;
        try {
            await deletePost(deletingPost._id || deletingPost.id)
            setPosts((prev) => prev.filter(p => (p._id || p.id) !== (deletingPost._id || deletingPost.id)))
            showToast("Post deleted successfully!", { type: "success" })
        } catch (err) {
            console.error("Failed to delete post:", err)
            showToast("Failed to delete post.", { type: "error" })
        } finally {
            setDeletingPost(null)
        }
    }

    const handleSaveEditPost = async () => {
        if (!editingPost) return;
        try {
            const updated = await updatePost(editingPost._id || editingPost.id, editingPost)
            setPosts(prev => prev.map(post => (post._id === updated._id ? updated : post)))
            setEditingPost(null)
            showToast("Post updated successfully!", { type: "success" })
        } catch (err) {
            console.error("Failed to update post:", err)
            showToast("Failed to update post.", { type: "error" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Posts Management</h2>
                <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                </Button>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <Card key={post._id || post.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Badge variant="outline">{post.category || (post.tags && post.tags[0])}</Badge>
                                        <span className="text-sm text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">by {post.author?.username || post.author || 'Unknown'}</p>
                                    <div className="flex space-x-4 text-sm text-gray-500">
                                        <span>{post.likes || post.votes || 0} likes</span>
                                        <span>{post.comments || post.commentCount || 0} comments</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setEditingPost(post)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeletingPost(post)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
            {deletingPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
                        <p>Are you sure you want to delete post <strong>{deletingPost.title}</strong>? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setDeletingPost(null)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleDeletePost}
                            >
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
