import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const ChatListItem = ({ chat, isSelected, onClick, currentUserId }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} phút`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';    
      default:
        return 'bg-gray-400';
    }
  };

  const getMessagePreview = (message) => {
    if (!message) return '';
    switch (message.type) {
      case 'text':
        return message.content.length > 50 
          ? message.content.substring(0, 50) + '...' 
          : message.content;
      case 'image':
        return '📷 Hình ảnh';
      case 'file':
        return '📎 File';
      default:
        return 'Tin nhắn mới';
    }
  };

  // Lấy recipient (participant khác current user)
  let recipient = null;
  if (chat.participants && currentUserId) {
    recipient = chat.participants.find(
      p => (p.user?._id || p.user) !== currentUserId
    );
  }

  const displayName = recipient?.user?.username || 'Không xác định';
  const avatarUrl = recipient?.user?.profilePicture || chat.avatar;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-foreground truncate">{displayName}</h4>
          {chat.lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {getMessagePreview(chat.lastMessage)}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            {chat.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Badge>
            )}
            {chat.isPinned && (
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem; 