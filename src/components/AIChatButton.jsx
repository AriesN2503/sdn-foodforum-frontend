import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { AIChat } from "./AIChat";
import postsApi from "../api/posts";

export function AIChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Chỉ tải dữ liệu khi người dùng mở chat
        if (isOpen && posts.length === 0) {
            loadPosts();
        }
    }, [isOpen, posts.length]);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            // Giả sử bạn có API endpoint để lấy tất cả bài đăng
            const fetchedPosts = await postsApi.getPosts({});
            setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
        } catch (error) {
            console.error("Error loading posts for AI chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 z-40 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-full h-14 w-14 flex items-center justify-center"
            >
                <MessageSquare className="h-6 w-6" />
            </Button>

            <AIChat
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                posts={posts}
            />
        </>
    );
}

export default AIChatButton;
