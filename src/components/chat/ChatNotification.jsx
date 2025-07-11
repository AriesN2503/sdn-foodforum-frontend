import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const ChatNotification = ({ notification, onClose, onClick }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
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

  return (
    <div 
      className="fixed bottom-4 right-4 w-80 bg-card border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-2"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={notification.senderAvatar} alt={notification.senderName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {notification.senderName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-foreground text-sm">{notification.senderName}</h4>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {formatTime(notification.timestamp)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">
            {getMessagePreview(notification.message)}
          </p>
          
          {notification.unreadCount > 1 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">
                {notification.unreadCount} tin nhắn mới
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatNotification; 