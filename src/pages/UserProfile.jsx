import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe, getUserProfile } from "../api/user";
import postsApi from "../api/posts";
import { getCommentsByUser } from "../api/comments";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PostCard } from "../components/PostCard";

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
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

      // Lấy posts
      const postsRes = await postsApi.getAllPosts({ authorUsername: userData.username });
      setPosts(postsRes.posts);

      // Lấy comments
      const commentsRes = await getCommentsByUser(userData.username);
      setComments(commentsRes.data.comments);

      setLoading(false);
    }
    fetchAll();
  }, [username, navigate]);

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <div>Không tìm thấy user</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <img src={user.avatar || user.profilePicture} alt={user.username} className="w-16 h-16 rounded-full" />
            <div>
              <CardTitle>{user.username}</CardTitle>
              <div className="text-gray-500 text-sm">{user.email}</div>
              <div className="text-gray-400 text-xs">Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Bài viết</TabsTrigger>
              <TabsTrigger value="comments">Bình luận</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {posts.length === 0 ? <div>Chưa có bài viết nào</div> : posts.map(post => <PostCard key={post._id} {...post} />)}
            </TabsContent>
            <TabsContent value="comments">
              {comments.length === 0 ? <div>Chưa có bình luận nào</div> : comments.map(c => (
                <div key={c._id} className="mb-4 border-b pb-2">
                  <div className="text-gray-700">{c.content}</div>
                  <div className="text-xs text-gray-400">
                    Trong bài: <a href={`/posts/${c.post.slug}`} className="text-orange-500 hover:underline">{c.post.title}</a>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
