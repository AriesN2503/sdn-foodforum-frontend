import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe, getUserProfile, updateUserProfile, uploadAvatar, changePassword, getFriendRequests, respondFriendRequest, getFriendsByUserId } from "../api/user";
import postsApi from "../api/posts";
import { getCommentsByUser } from "../api/comments";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PostCard } from "../components/PostCard";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useRef } from "react";
import { Button } from "../components/ui/button";
import { Eye, EyeOff, Camera } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

export default function UserProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [editing, setEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.profilePicture || "");
    const [newAvatar, setNewAvatar] = useState(null);
    const [bio, setBio] = useState(user?.bio || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef();
    const [oldPassword, setOldPassword] = useState("");
    const [role, setRole] = useState("");
    const { toast } = useToast();
    const [postStatusFilter, setPostStatusFilter] = useState("approved");
    const [postsLoading, setPostsLoading] = useState(false);
    const [friendsTab, setFriendsTab] = useState("all"); // all | requests
    const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                let userData;
                if (username) {
                    const res = await getUserProfile(username);
                    userData = res.data;
                } else {
                    const res = await getMe();
                    userData = res.data;
                    navigate(`/profile/${userData.username}`, { replace: true });
                    return;
                }
                setUser(userData);
                setRole(userData.role || "user");
                // Chỉ set các state này nếu chưa ở chế độ editing
                setBio(userData.bio || "");
                setAvatarPreview(userData.avatar || userData.profilePicture || "");
                setNewAvatar(null);
                setPassword("");
                setConfirmPassword("");
                setOldPassword(""); // Reset old password when loading
                // Lấy posts
                if (activeTab !== "posts") {
                    const postsRes = await postsApi.getAllPosts({ authorUsername: userData.username });
                    setPosts(postsRes.posts);
                }
                // Lấy comments
                const commentsRes = await getCommentsByUser(userData.username);
                setComments(commentsRes.data.comments);
                // Lấy danh sách lời mời kết bạn
                getFriendRequests().then(setFriendRequests).catch(() => {});
            } catch (error) {
                const errorMsg = error?.response?.data?.error || error.message || 'Đã xảy ra lỗi khi tải dữ liệu người dùng.';
                toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [username, navigate, activeTab]);

    // Fetch posts by status when filter changes or when switching to posts tab
    useEffect(() => {
        if (activeTab !== "posts" || !user?._id) return;
        let status = postStatusFilter;
        if (status === "rejected") status = "rejected";
        setPostsLoading(true);
        postsApi.getUserPostsByStatus(user._id, status)
            .then(res => setPosts(res || []))
            .catch(error => {
                const errorMsg = error?.response?.data?.error || error.message || 'Không thể tải bài viết.';
                toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
                setPosts([]);
            })
            .finally(() => setPostsLoading(false));
    }, [postStatusFilter, user?._id, activeTab]);

    useEffect(() => {
        if (activeTab === "friends" && user?._id) {
            getFriendsByUserId(user._id)
                .then(setFriends)
                .catch(() => setFriends([]));
        }
    }, [activeTab, user?._id]);

    if (loading) return <div>Đang tải...</div>;
    if (!user) return <div>Không tìm thấy user</div>;

    console.log('posts: ', posts)

    // Hàm xử lý upload avatar
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            try {
                // Gọi API upload và lấy url preview
                const uploadRes = await uploadAvatar(file);
                setAvatarPreview(uploadRes.url || uploadRes.imageUrl);
                toast({ title: "Thành công", description: "Tải ảnh thành công!", variant: "default" });
            } catch (error) {
                const errorMsg = error?.response?.data?.error || error.message || 'Tải ảnh thất bại!';
                toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
            }
        }
    };

    // Hàm lưu thay đổi
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            let avatarUrl = avatarPreview;
            if (newAvatar) {
                avatarUrl = avatarPreview;
            }
            // Nếu cả 3 trường password đều có giá trị thì đổi mật khẩu trước
            if (oldPassword && password && confirmPassword) {
                if (password !== confirmPassword) {
                    toast({ title: "Lỗi", description: "Mật khẩu xác nhận không khớp!", variant: "destructive" });
                    return;
                }
                try {
                    if (role === "admin") {
                        await changePassword(user._id, undefined, password);
                    } else {
                        await changePassword(user._id, oldPassword, password);
                    }
                    toast({ title: "Thành công", description: "Đổi mật khẩu thành công!", variant: "default" });
                } catch (error) {
                    const errorMsg = error?.response?.data?.error || error.message || 'Đổi mật khẩu thất bại!';
                    toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
                    return;
                }
            }
            // Sau khi đổi mật khẩu (hoặc không đổi), cập nhật hồ sơ
            try {
                await updateUserProfile(user._id, {
                    bio,
                    avatar: avatarUrl,
                });
                toast({ title: "Thành công", description: "Cập nhật hồ sơ thành công!", variant: "default" });
                setEditing(false);
            } catch (error) {
                const errorMsg = error?.response?.data?.error || error.message || 'Cập nhật hồ sơ thất bại!';
                toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleRespondRequest = async (requestId, action) => {
        try {
            await respondFriendRequest(requestId, action);
            toast({ title: "Thành công", description: action === "accept" ? "Đã chấp nhận lời mời." : "Đã từ chối lời mời.", variant: "default" });
            // Cập nhật lại danh sách lời mời
            const reqs = await getFriendRequests();
            setFriendRequests(reqs);
            // Nếu accept thì chuyển sang tab tất cả bạn bè và reload friends
            if (action === "accept") {
                setFriendsTab("all");
                if (user && user._id) {
                    const newFriends = await getFriendsByUserId(user._id);
                    setFriends(newFriends);
                }
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.error || error.message || "Không thể xử lý lời mời.";
            toast({ title: "Lỗi", description: errorMsg, variant: "destructive" });
        }
    };


    return (
        <div className="max-w-7xl mx-auto py-8 flex gap-8">
            {/* Sidebar thông tin user + sidemenu */}
            <div className="w-1/4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col items-center gap-4">
                            <img src={user.avatar || user.profilePicture} alt={user.username} className="w-20 h-20 rounded-full" />
                            <CardTitle className="text-center">{user.username}</CardTitle>
                            <div className="text-gray-500 text-sm text-center">{user.email}</div>
                            <div className="text-gray-400 text-xs text-center">Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</div>
                        </div>
                    </CardHeader>
                </Card>
                {/* Sidemenu */}
                <div className="mt-6">
                    <nav className="flex flex-col gap-2">
                        <button
                            className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "profile" ? "bg-orange-100 text-orange-600 font-semibold" : "hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Hồ sơ người dùng
                        </button>
                        <button
                            className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "posts" ? "bg-orange-100 text-orange-600 font-semibold" : "hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Các bài viết của bạn
                        </button>
                        <button
                            className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "activity" ? "bg-orange-100 text-orange-600 font-semibold" : "hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("activity")}
                        >
                            Hoạt động bình luận, đánh giá
                        </button>
                        <button
                            className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "friends" ? "bg-orange-100 text-orange-600 font-semibold" : "hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("friends")}
                        >
                            Bạn bè
                        </button>
                    </nav>
                </div>
            </div>
            {/* Tabs bên phải */}
            <div className="flex-1">
                <Card>
                    <CardContent>
                        {/* Tabs không còn TabsList, dùng state activeTab để điều khiển */}
                        <div className="mb-4" />
                        {activeTab === "profile" && (
                            <form className="space-y-6 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <div className="relative group">
                                        <img src={avatarPreview} alt={user.username} className="w-24 h-24 rounded-full object-cover border shadow" />
                                        {editing && (
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow group-hover:bg-orange-100 transition-colors"
                                                onClick={() => fileInputRef.current.click()}
                                                title="Đổi ảnh đại diện"
                                            >
                                                <Camera className="w-5 h-5 text-orange-500" />
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên người dùng</label>
                                    <Input value={user.username} readOnly disabled className="bg-gray-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input value={user.email} readOnly disabled className="bg-gray-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giới thiệu bản thân (bio)</label>
                                    <Textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Viết đôi dòng về bạn..."
                                        rows={3}
                                        disabled={!editing ? true : false}
                                    />
                                </div>
                                
                                {role !== "admin" && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                                        <Input
                                            type="password"
                                            placeholder="Nhập mật khẩu hiện tại để đổi mật khẩu"
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                            disabled={!editing ? true : false}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Đổi mật khẩu (tuỳ chọn)"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={!editing ? true : false}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-2 text-gray-400"
                                            onClick={() => setShowPassword(v => !v)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            disabled={!editing ? true : false}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-2 text-gray-400"
                                            onClick={() => setShowConfirmPassword(v => !v)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {!editing ? (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setEditing(true);
                                                setSaving(false);
                                                setBio(user.bio || "");
                                                setAvatarPreview(user.avatar || user.profilePicture || "");
                                                setNewAvatar(null);
                                                setPassword("");
                                                setConfirmPassword("");
                                                setOldPassword(""); // Reset old password when editing
                                            }}
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                                disabled={saving || (password && password !== confirmPassword)}
                                                onClick={handleSaveProfile}
                                            >
                                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditing(false);
                                                    setAvatarPreview(user.avatar || user.profilePicture || "");
                                                    setNewAvatar(null);
                                                    setPassword("");
                                                    setConfirmPassword("");
                                                    setBio(user.bio || "");
                                                    setOldPassword(""); // Reset old password when cancelling
                                                }}
                                            >
                                                Huỷ
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}
                        {activeTab === "posts" && (
                            <>
                                <div className="mb-4 flex gap-2">
                                    <Button
                                        type="button"
                                        variant={postStatusFilter === "approved" ? "default" : "outline"}
                                        className={postStatusFilter === "approved" ? "bg-orange-500 text-white" : ""}
                                        onClick={() => setPostStatusFilter("approved")}
                                    >
                                        Đã duyệt
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={postStatusFilter === "pending" ? "default" : "outline"}
                                        className={postStatusFilter === "pending" ? "bg-orange-500 text-white" : ""}
                                        onClick={() => setPostStatusFilter("pending")}
                                    >
                                        Chờ duyệt
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={postStatusFilter === "rejected" ? "default" : "outline"}
                                        className={postStatusFilter === "rejected" ? "bg-orange-500 text-white" : ""}
                                        onClick={() => setPostStatusFilter("rejected")}
                                    >
                                        Đã từ chối
                                    </Button>
                                </div>
                                {postsLoading ? (
                                    <div>Đang tải bài viết...</div>
                                ) : posts.length === 0 ? (
                                    <div>Chưa có bài viết nào</div>
                                ) : (
                                    posts.map(post => <PostCard key={post._id} {...post} />)
                                )}
                            </>
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
                        {activeTab === "friends" && (
                            <div>
                                <div className="flex gap-2 mb-4">
                                    <Button variant={friendsTab === "all" ? "default" : "outline"} onClick={() => setFriendsTab("all")}>Tất cả bạn bè</Button>
                                    <Button variant={friendsTab === "requests" ? "default" : "outline"} onClick={() => setFriendsTab("requests")}>Lời mời kết bạn</Button>
                                </div>
                                {friendsTab === "all" && (
                                    <div>
                                        {(!friends || friends.length === 0) ? <div>Chưa có bạn bè nào.</div> : (
                                            <ul className="space-y-2">
                                                {friends.map(f => (
                                                    <li key={f._id} className="flex items-center gap-4 border-b py-3">
                                                        <img src={f.avatar} alt={f.username} className="w-10 h-10 rounded-full object-cover border" />
                                                        <button
                                                            className="font-semibold text-base text-gray-800 hover:text-orange-600 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                                                            onClick={() => navigate(`/user/${f.username}`)}
                                                        >
                                                            {f.username}
                                                        </button>
                                                        {f.isOnline ? <span className="text-green-500 text-xs ml-2">● Online</span> : <span className="text-gray-400 text-xs ml-2">Offline</span>}
                                                        <span className="text-gray-500 text-xs ml-2">{f.bio}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {friendsTab === "requests" && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Lời mời đã nhận</h3>
                                        {friendRequests.received.length === 0 ? <div>Không có lời mời nào.</div> : friendRequests.received.map(req => (
                                            <div key={req._id} className="flex items-center gap-4 border-b py-3">
                                                <img src={req.from?.avatar} alt={req.from?.username} className="w-10 h-10 rounded-full object-cover border" />
                                                <button
                                                    className="font-semibold text-base text-gray-800 hover:text-orange-600 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                                                    onClick={() => navigate(`/user/${req.from?.username}`)}
                                                >
                                                    {req.from?.username}
                                                </button>
                                                <Button size="sm" className="ml-2 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleRespondRequest(req._id, "accept")}>Chấp nhận</Button>
                                                <Button size="sm" variant="outline" className="ml-2" onClick={() => handleRespondRequest(req._id, "reject")}>Từ chối</Button>
                                            </div>
                                        ))}
                                        <h3 className="font-semibold mt-4 mb-2">Lời mời đã gửi</h3>
                                        {friendRequests.sent.length === 0 ? <div>Không có lời mời nào.</div> : friendRequests.sent.map(req => (
                                            <div key={req._id} className="flex items-center gap-4 border-b py-3">
                                                <img src={req.to?.avatar} alt={req.to?.username} className="w-10 h-10 rounded-full object-cover border" />
                                                <button
                                                    className="font-semibold text-base text-gray-800 hover:text-orange-600 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                                                    onClick={() => navigate(`/user/${req.to?.username}`)}
                                                >
                                                    {req.to?.username}
                                                </button>
                                                <span className="text-gray-500 text-xs ml-2">(Đang chờ)</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
