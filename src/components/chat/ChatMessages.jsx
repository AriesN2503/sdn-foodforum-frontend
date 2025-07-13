import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatMessagesSkeleton from './ChatMessagesSkeleton';

const ChatMessages = ({ messages, currentUser, isLoading, onReply }) => {
    const messagesEndRef = useRef(null);

    console.log('messages in ChatMessages: ', messages)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (diffInHours < 48) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit' 
            });
        }
    };

    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(message => {
            const date = new Date(message.timestamp || message.createdAt).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    // Kiểm tra xem message có phải của current user không
    const isOwnMessage = (message) => {
        const currentUserId = currentUser?.id || currentUser?._id;
        const messageSenderId = message.senderId || message.sender?._id || message.sender;
        return currentUserId === messageSenderId;
    };


    if (isLoading) {
        return <ChatMessagesSkeleton />;
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-sm">Chưa có tin nhắn nào</p>
                        <p className="text-xs">Bắt đầu cuộc trò chuyện!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {Object.entries(groupMessagesByDate(messages)).map(([date, groupMessages]) => (
                <div key={date} className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="bg-muted px-3 py-1 rounded-full">
                            <span className="text-xs text-muted-foreground">
                                {new Date(date).toLocaleDateString('vi-VN', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                    {groupMessages.map((message, index) => {
                        const isOwn = isOwnMessage(message);
                        const showAvatar = !isOwn && (index === 0 || 
                            !isOwnMessage(groupMessages[index - 1]));
                        const showTime = index === groupMessages.length - 1 || 
                            groupMessages[index + 1]?.senderId !== message.senderId;
                        
                        return (
                            <ChatMessage
                                key={message._id || message.id || index}
                                message={message}
                                isOwn={isOwn}
                                showAvatar={showAvatar}
                                showTime={showTime}
                                formatTime={formatTime}
                                onReply={onReply}
                                currentUser={currentUser}
                            />
                        );
                    })}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages; 