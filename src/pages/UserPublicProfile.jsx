import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import postsApi from "../api/posts";
import { getUserProfile } from "../api/user";
import { getCommentsByUser } from "../api/comments";
import { PostCard } from "../components/PostCard";
import { sendFriendRequest, getMe, getFriendRequests, respondFriendRequest } from "../api/user";
import { useToast } from "../components/ui/use-toast";

export default function UserPublicProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(true);
    const [friendStatus, setFriendStatus] = useState("none"); // none | requested | friends
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState(null);
    const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });

    // Fetch bài viết đã duyệt khi vào tab 'Bài viết'
    useEffect(() => {
        if (activeTab === "posts" && user?._id) {
            postsApi.getUserPostsByStatus(user._id, "approved")
                .then(res => setPosts(Array.isArray(res) ? res : (res.posts || [])))
                .catch(() => setPosts([]));
        }
    }, [activeTab, user?._id]);

    // Fetch comment, upvote khi vào tab 'Hoạt động'
    useEffect(() => {
        if (activeTab === "activity" && user?.username) {
            getCommentsByUser(user.username)
                .then(res => setComments(res.data.comments || []))
                .catch(() => setComments([]));
            // TODO: Fetch upvotes nếu có API
        }
    }, [activeTab, user?.username]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const meRes = await getMe();
                setCurrentUser(meRes.data || meRes);
                const res = await getUserProfile(username);
                setUser(res.data);
                // Không fetch posts/comments ở đây nữa
                // Lấy danh sách lời mời kết bạn nếu là profile của mình
                if (meRes.data && res.data.username === meRes.data.username) {
                    setFriendStatus("self");
                    const reqs = await getFriendRequests();
                    setFriendRequests(reqs);
                }
                // Kiểm tra trạng thái bạn bè
                if (meRes.data && res.data.friends && res.data.friends.includes(meRes.data._id)) {
                    setFriendStatus("friends");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const handleFriendRequest = async () => {
        if (!user || !currentUser) return;
        if (user.username === currentUser.username) return;
        try {
            await sendFriendRequest(user._id);
            setFriendStatus("requested");
            toast({ title: "Thành công", description: "Đã gửi lời mời kết bạn.", variant: "default" });
        } catch (error) {
            const errorMsg = error?.response?.data?.error || error.message || "Không thể gửi lời mời kết bạn.";
            toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
            if (errorMsg.includes("Đã gửi lời mời")) setFriendStatus("requested");
            if (errorMsg.includes("Đã là bạn bè")) setFriendStatus("friends");
        }
    };

    const handleRespondRequest = async (requestId, action) => {
        try {
            await respondFriendRequest(requestId, action);
            toast({ title: "Thành công", description: action === "accept" ? "Đã chấp nhận lời mời." : "Đã từ chối lời mời.", variant: "default" });
            // Cập nhật lại danh sách lời mời
            const reqs = await getFriendRequests();
            setFriendRequests(reqs);
        } catch (error) {
            const errorMsg = error?.response?.data?.error || error.message || "Không thể xử lý lời mời.";
            toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!user) return <div>Không tìm thấy user</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-6">
                        <img src={user.avatar || user.profilePicture} alt={user.username} className="w-24 h-24 rounded-full object-cover border" />
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                            <div className="text-gray-500 text-sm">Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</div>
                            <div className="text-gray-700 mt-2">{user.bio}</div>
                        </div>
                        <div className="ml-auto flex flex-col gap-2 items-end">
                            {friendStatus === "self" ? null : friendStatus === "none" && (
                                <Button onClick={handleFriendRequest}>Kết bạn</Button>
                            )}
                            {friendStatus === "requested" && (
                                <Button disabled>Đã gửi lời mời</Button>
                            )}
                            {friendStatus === "friends" && (
                                <Button disabled>Bạn bè</Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Quản lý lời mời kết bạn nếu là profile của mình */}
                    {friendStatus === "self" && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Lời mời kết bạn</h3>
                            <div className="mb-2">
                                <b>Đã nhận ({friendRequests.received.length}):</b>
                                {friendRequests.received.length === 0 ? <div>Không có lời mời nào.</div> : friendRequests.received.map(req => (
                                    <div key={req._id} className="flex items-center gap-2 border-b py-2">
                                        <span>{req.from?.username}</span>
                                        <Button size="sm" onClick={() => handleRespondRequest(req._id, "accept")}>Chấp nhận</Button>
                                        <Button size="sm" variant="outline" onClick={() => handleRespondRequest(req._id, "reject")}>Từ chối</Button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <b>Đã gửi ({friendRequests.sent.length}):</b>
                                {friendRequests.sent.length === 0 ? <div>Không có lời mời nào.</div> : friendRequests.sent.map(req => (
                                    <div key={req._id} className="flex items-center gap-2 border-b py-2">
                                        <span>{req.to?.username}</span>
                                        <span className="text-gray-500 text-xs">(Đang chờ)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-6 mb-6">
                        <Button variant={activeTab === "posts" ? "default" : "outline"} onClick={() => setActiveTab("posts")}>Bài viết</Button>
                        <Button variant={activeTab === "activity" ? "default" : "outline"} onClick={() => setActiveTab("activity")}>Hoạt động</Button>
                        {/* Không có tab Bạn bè ở public profile */}
                    </div>
                    {activeTab === "posts" && (
                        posts.length === 0 ? <div>Chưa có bài viết nào</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {posts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        id={post._id}
                                        title={post.title}
                                        content={post.description}
                                        author={post.author}
                                        commentsCount={post.commentsCount}
                                        imageUrl={post.thumbnailUrl}
                                        slug={post.slug}
                                        upvotes={post.upvotes}
                                        downvotes={post.downvotes}
                                        viewsCount={post.viewsCount}
                                        categories={post.categories}
                                        status={post.status}
                                    />
                                ))}
                            </div>
                        )
                    )}
                    {activeTab === "activity" && (
                        comments.length === 0 ? <div>Chưa có hoạt động nào</div> : comments.map(c => (
                            <div key={c._id} className="mb-4 border-b pb-2">
                                <div className="text-gray-700">{c.content}</div>
                                <div className="text-xs text-gray-400">
                                    Trong bài: <a href={`/posts/${c.post.slug}`} className="text-orange-500 hover:underline">{c.post.title}</a>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 