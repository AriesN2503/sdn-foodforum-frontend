import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { MessageSquare, Send, X, Bot, User, Loader2, Clock, Users, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import aiApi from "../api/ai";

// Simple PostCard component for AI suggestions
const AIPostCard = ({ post, onClick }) => {
    return (
        <Card className="mb-2 hover:border-orange-500 cursor-pointer transition-all" onClick={onClick}>
            <CardContent className="p-3">
                <CardTitle className="text-sm text-orange-600">{post.title}</CardTitle>
                {post.category && (
                    <CardDescription className="text-xs mt-1">{post.category}</CardDescription>
                )}
                {post.difficulty && (
                    <div className="flex items-center mt-2 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Độ khó: {post.difficulty}</span>
                    </div>
                )}
                {(post.prepTime || post.cookTime) && (
                    <div className="flex items-center mt-1 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.prepTime ? `Chuẩn bị: ${post.prepTime} phút` : ''} {post.cookTime ? `Nấu: ${post.cookTime} phút` : ''}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// AI response function with fallback to client-side filtering
const getAIResponse = async (message, posts) => {
    try {
        // Thử sử dụng API backend
        const response = await aiApi.sendQuestion(message, { posts });
        // Đảm bảo trả về chuỗi
        return String(response.answer || response.content || response);
    } catch (error) {
        console.warn("AI API request failed, falling back to client-side filtering", error);
        // Fallback to client-side filtering if API fails

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample logic to filter posts based on user query
        // In a real implementation, this would be handled by your backend
        const query = message.toLowerCase();
        let response = "";

        if (query.includes("breakfast") || query.includes("bữa sáng")) {
            const breakfastPosts = posts.filter(post =>
                post.title?.toLowerCase().includes("breakfast") ||
                post.content?.toLowerCase().includes("breakfast") ||
                post.title?.toLowerCase().includes("morning") ||
                post.title?.toLowerCase().includes("bữa sáng") ||
                post.content?.toLowerCase().includes("bữa sáng")
            );

            if (breakfastPosts.length > 0) {
                response = `Tôi tìm thấy ${breakfastPosts.length} món ăn cho bữa sáng mà bạn có thể thích:\n\n`;
                breakfastPosts.slice(0, 3).forEach((post, index) => {
                    response += `${index + 1}. **${post.title}** - ${post.content?.substring(0, 100) || ""}...\n`;
                });

                if (breakfastPosts.length > 3) {
                    response += `\n...và ${breakfastPosts.length - 3} món khác.`;
                }
            } else {
                response = "Tôi không tìm thấy món ăn nào cho bữa sáng. Bạn có thể thử tìm món ăn khác hoặc tạo công thức mới!";
            }
        } else if (query.includes("lunch") || query.includes("bữa trưa")) {
            // Similar logic for lunch
            response = "Đây là một số gợi ý cho bữa trưa của bạn...";
        } else if (query.includes("dinner") || query.includes("bữa tối")) {
            // Similar logic for dinner
            response = "Đây là một số gợi ý cho bữa tối của bạn...";
        } else if (query.includes("recipe") || query.includes("công thức")) {
            // Logic for recipe requests
            response = "Đây là một số công thức nấu ăn phổ biến từ cộng đồng của chúng tôi...";
        } else {
            response = "Tôi là trợ lý AI Food Forum. Tôi có thể giúp bạn tìm kiếm các món ăn, công thức nấu ăn hoặc gợi ý dựa trên thời điểm trong ngày. Hãy hỏi tôi về bữa sáng, bữa trưa, bữa tối hoặc bất kỳ loại món ăn nào bạn quan tâm!";
        }

        return response;
    }
};

export function AIChat({ posts = [], isOpen, onClose }) {
    const navigate = useNavigate();
    const welcomeMessage = getCurrentTimeGreeting();

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `${welcomeMessage} Tôi là trợ lý AI của Food Forum. Tôi có thể giúp gợi ý những món ăn phù hợp với nhu cầu của bạn. Bạn muốn tìm món gì cho bữa ăn hôm nay?`
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([
        "Gợi ý món ăn cho bữa sáng?",
        "Món ngon cho bữa tối?",
        "Các món ăn dễ làm?",
        "Món ăn healthy?"
    ]);
    const messagesEndRef = useRef(null);

    function getCurrentTimeGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng!";
        if (hour < 18) return "Chào buổi chiều!";
        return "Chào buổi tối!";
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (directContent) => {
        // Đảm bảo messageToSend luôn là chuỗi
        if (Object.is(input, null) || Object.is(directContent, null)) {
            console.log(JSON.stringify({ input, directContent }, null, 2));
        }
        const messageToSend = String(input || directContent);

        if (messageToSend.trim() === "") return;

        const userMessage = {
            role: "user",
            content: messageToSend
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await getAIResponse(messageToSend, posts);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: response
                }
            ]);

            // Generate new suggested questions based on conversation context
            const newSuggestions = generateSuggestedQuestions(messageToSend);
            if (newSuggestions.length > 0) {
                setSuggestedQuestions(newSuggestions);
            }
        } catch (error) {
            console.error("Error getting AI response:", error);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Format message to handle special formatting and extract card data
    const formatMessage = (text) => {
        // Đảm bảo text là chuỗi
        const safeText = typeof text === 'string' ? text : String(text || '');

        // Extract card data
        const cardRegex = /CARD_START\s*({[\s\S]*?})\s*CARD_END/g;
        let match;
        let cards = [];
        let processedText = safeText;

        while ((match = cardRegex.exec(safeText)) !== null) {
            try {
                const cardData = JSON.parse(match[1]);
                cards.push(cardData);
                // Remove the card markup from text
                processedText = processedText.replace(match[0], '');
            } catch (e) {
                console.error("Failed to parse card data:", e);
            }
        }

        // Extract post links and convert them to cards
        // Format: post/ID hoặc post/{ID}
        const postLinkRegex = /\s*\(?post\/([a-zA-Z0-9]+)\)?:?\s*(.*?)(?=\n|$|\(post\/)/g;
        let linkMatch;

        while ((linkMatch = postLinkRegex.exec(processedText)) !== null) {
            const id = linkMatch[1];
            // Tìm tiêu đề từ text gần đó
            let title = linkMatch[2].trim();

            // Nếu tiêu đề nằm trong dấu ** hoặc bắt đầu bằng ":" hoặc "-", làm sạch nó
            title = title.replace(/^\s*[:*\-–—]\s*/, '');  // Xóa các ký tự đầu tiên
            title = title.replace(/^\*\*(.*?)\*\*$/, '$1');  // Xóa dấu **

            if (title && id) {
                cards.push({
                    id: id,
                    title: title,
                    // Các thông tin khác có thể không có sẵn trong văn bản
                    category: 'Món ngon'
                });

                // Thay thế đoạn link trong văn bản bằng khoảng trắng để tránh hiển thị trùng lặp
                processedText = processedText.replace(linkMatch[0], ' ');
            }
        }

        // Handle bold text
        let formattedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle links for post IDs (for backward compatibility - với những trường hợp khác)
        formattedText = formattedText.replace(/post\/([a-zA-Z0-9]+)/g, (match, id) => {
            return `<a href="#" class="text-orange-500 underline" data-post-id="${id}">${match}</a>`;
        });

        // Handle newlines
        formattedText = formattedText.split('\n').map((line) => `<div>${line || '&nbsp;'}</div>`).join('');        // Return object with formatted text and cards
        return {
            html: formattedText,
            cards: cards
        };
    };

    // Generate dynamic follow-up questions
    const generateSuggestedQuestions = (userMessage) => {
        const lowerUserMsg = userMessage.toLowerCase();
        // Future enhancement: Use aiResponse for context-aware suggestions

        // Breakfast related
        if (lowerUserMsg.includes('breakfast') || lowerUserMsg.includes('bữa sáng')) {
            return [
                "Tôi muốn một món ăn sáng healthy",
                "Có món ăn sáng nhanh gọn không?",
                "Món ăn sáng phổ biến nhất là gì?",
                "Công thức làm bánh mì sandwich?"
            ];
        }

        // Dinner related
        if (lowerUserMsg.includes('dinner') || lowerUserMsg.includes('bữa tối')) {
            return [
                "Món ăn tối nhẹ nhàng?",
                "Công thức làm pasta?",
                "Món ăn tối cho gia đình?",
                "Món súp ngon cho bữa tối?"
            ];
        }

        // Recipe related
        if (lowerUserMsg.includes('recipe') || lowerUserMsg.includes('công thức')) {
            return [
                "Công thức món Việt Nam?",
                "Cách làm bánh ngọt?",
                "Món ăn dễ làm nhất?",
                "Công thức nấu phở?"
            ];
        }

        // Default questions
        return [
            "Gợi ý món ăn cho bữa trưa?",
            "Món tráng miệng ngon?",
            "Món ăn cho người ăn chay?",
            "Món đặc sản nổi tiếng?"
        ];
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Card className="w-80 sm:w-96 shadow-lg">
                <CardHeader className="bg-orange-500 text-white py-2 px-4 flex flex-row justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                        <Bot className="mr-2 h-5 w-5" />
                        Food AI Assistant
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-white hover:bg-orange-600">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="h-72 overflow-y-auto p-4 space-y-4">
                        {/* Suggested questions appear after the AI messages */}
                        {messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isLoading && (
                            <div className="flex flex-wrap gap-2 mt-4 mb-2">
                                {suggestedQuestions.map((question, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs bg-orange-50 border-orange-200 hover:bg-orange-100"
                                        onClick={() => {
                                            setInput(question);
                                            handleSend(question);
                                        }}
                                    >
                                        {question}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                        message.role === "user"
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    )}
                                >
                                    <div className="flex items-center mb-1">
                                        {message.role === "assistant" ? (
                                            <Bot className="h-3 w-3 mr-1" />
                                        ) : (
                                            <User className="h-3 w-3 mr-1" />
                                        )}
                                        <span className="font-semibold">
                                            {message.role === "assistant" ? "Food AI" : "Bạn"}
                                        </span>
                                    </div>

                                    {message.role === "assistant" ? (
                                        <>
                                            {(() => {
                                                // Đảm bảo message.content là chuỗi trước khi xử lý
                                                const content = typeof message.content === 'string' ? message.content : String(message.content || '');
                                                const formattedContent = formatMessage(content);
                                                return (
                                                    <>
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: formattedContent.html }}
                                                            onClick={(e) => {
                                                                // Handle clicks on post links
                                                                if (e.target.tagName === 'A' && e.target.dataset.postId) {
                                                                    e.preventDefault();
                                                                    navigate(`/post/${e.target.dataset.postId}`);
                                                                }
                                                            }}
                                                        />
                                                        {formattedContent.cards && formattedContent.cards.length > 0 && (
                                                            <div className="mt-3">
                                                                {formattedContent.cards.map((cardData, cardIdx) => (
                                                                    <AIPostCard
                                                                        key={cardIdx}
                                                                        post={cardData}
                                                                        onClick={() => navigate(`/post/${cardData.id}`)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <div>{message.content}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span>Đang suy nghĩ...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </CardContent>

                <CardFooter className="p-2 border-t">
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={isLoading || input.trim() === ""}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default AIChat;
