import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
    Edit, Trash2, Plus, Search, Clock, CheckCircle, XCircle, Filter, Eye,
    ThumbsUp, MessageSquare, X
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";
import postsApi from "../api/posts";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";

export default function UserPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Fetch user's posts
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user || !user.id) return;

            setIsLoading(true);
            try {
                const userPosts = await postsApi.getPostsByUser(user.id);
                setPosts(userPosts);
            } catch (error) {
                console.error("Error fetching user posts:", error);
                showToast("Failed to load your posts. Please try again.", { type: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, [user, showToast]);

    // Handle edit post
    const handleEditPost = (postId) => {
        const post = posts.find(p => p._id === postId);
        if (post) {
            setPostToEdit(post);
            setEditTitle(post.title);
            setEditContent(post.content);
            setEditDialogOpen(true);
        }
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!postToEdit) return;

        try {
            await postsApi.updatePost(postToEdit._id, {
                title: editTitle,
                content: editContent
            });

            // Update local posts state
            setPosts(posts.map(post =>
                post._id === postToEdit._id
                    ? { ...post, title: editTitle, content: editContent }
                    : post
            ));

            setEditDialogOpen(false);
            showToast("Post updated successfully", { type: "success" });
        } catch (error) {
            console.error("Failed to update post:", error);
            showToast("Failed to update post", { type: "error" });
        }
    };

    // Handle delete post
    const handleDeletePost = async (postId) => {
        setPostToDelete(postId);
        setDeleteDialogOpen(true);
    };

    // Confirm delete post
    const confirmDeletePost = async () => {
        if (!postToDelete) return;

        try {
            await postsApi.deletePost(postToDelete);
            setPosts(posts.filter(post => post._id !== postToDelete));
            setDeleteDialogOpen(false);
            showToast("Post deleted successfully", { type: "success" });
        } catch (error) {
            console.error("Failed to delete post:", error);

            // Show more specific error message based on status code
            if (error.response) {
                if (error.response.status === 403) {
                    showToast("You don't have permission to delete this post", { type: "error" });
                } else if (error.response.status === 404) {
                    showToast("Post not found. It may have been already deleted.", { type: "error" });
                    // Remove from local state since it's gone on the server
                    setPosts(posts.filter(post => post._id !== postToDelete));
                } else {
                    showToast(`Error: ${error.response.data?.message || "Failed to delete post"}`, { type: "error" });
                }
            } else {
                showToast("Failed to delete post. Please try again later.", { type: "error" });
            }

            setDeleteDialogOpen(false);
        }
    };    // Filter posts based on search term and status
    const filteredPosts = posts.filter(post => {
        // Apply search filter
        const matchesSearch =
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply status filter
        let matchesStatus = true;
        if (filterStatus !== 'all') {
            matchesStatus = post.status === filterStatus;
        }

        return matchesSearch && matchesStatus;
    });

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Posts</h1>
                <Button
                    onClick={() => navigate("/create-post")}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                </Button>
            </div>

            <div className="flex space-x-4 items-center mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search your posts..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading your posts...</div>
            ) : filteredPosts.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-500">
                            {searchTerm || filterStatus !== 'all'
                                ? "No posts match your search criteria."
                                : "You haven't created any posts yet."}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Button
                                onClick={() => navigate("/create-post")}
                                variant="outline"
                                className="mt-4"
                            >
                                Create Your First Post
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <div key={post._id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-medium text-lg mb-1">{post.title}</div>
                                    <div className="text-sm text-gray-500 mb-2">{post.content}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    {getStatusBadge(post.status)}
                                    <div className="text-sm text-gray-500 mt-1">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center text-gray-500 text-sm">
                                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                        {post.votes?.length || 0}
                                    </span>
                                    <span className="flex items-center text-gray-500 text-sm">
                                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                        {post.comments?.length || 0}
                                    </span>
                                    {post.category && (
                                        <Badge variant="outline">{post.category.name}</Badge>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/post/${post._id}`)}>
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                    {post.status === 'pending' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditPost(post._id)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeletePost(post._id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {post.status === 'rejected' && post.rejectionReason && (
                                <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-800 break-words">
                                    <strong>Rejection reason:</strong> {post.rejectionReason}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeletePost}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Post Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>
                            Make changes to your post here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input
                                id="title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Post title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="content" className="text-sm font-medium">Content</label>
                            <Textarea
                                id="content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Post content"
                                rows={8}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
