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
    ThumbsUp, MessageSquare
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

export default function UserPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
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
        navigate(`/edit-post/${postId}`);
    };

    // Handle delete post
    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await postsApi.deletePost(postId);
                setPosts(posts.filter(post => post._id !== postId));
                showToast("Post deleted successfully", { type: "success" });
            } catch (error) {
                console.error("Failed to delete post:", error);
                showToast("Failed to delete post", { type: "error" });
            }
        }
    };

    // Filter posts based on search term and status
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPosts.map((post) => (
                        <Card key={post._id} className="overflow-hidden flex flex-col h-full">
                            <CardHeader className="pb-2 space-y-2">
                                <div className="flex items-center justify-between mb-1">
                                    {getStatusBadge(post.status)}
                                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="truncate text-lg">{post.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-sm">{post.content}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4 flex-grow">
                                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3">
                                    <span className="flex items-center">
                                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                        {post.votes?.length || 0}
                                    </span>
                                    <span className="flex items-center">
                                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                        {post.comments?.length || 0}
                                    </span>
                                    {post.category && (
                                        <Badge variant="outline" className="ml-auto">{post.category.name}</Badge>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t flex justify-between mt-auto p-3">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/post/${post._id}`)}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Button>
                                <div className="flex gap-2">
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
                            </CardFooter>
                            {post.status === 'rejected' && post.rejectionReason && (
                                <div className="p-2.5 bg-red-50 border-t border-red-100 text-xs text-red-800 break-words">
                                    <strong>Rejection reason:</strong> {post.rejectionReason}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
