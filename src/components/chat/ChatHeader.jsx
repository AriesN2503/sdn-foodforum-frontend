import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu';

const ChatHeader = ({ chat, onDeleteChat, onArchiveChat, currentUserId }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Đang hoạt động';
      case 'offline':
        return 'Ngoại tuyến';
      default:
        return 'Không xác định';
    }
  };

  // Lấy recipient (participant khác current user)
  console.log('chat', chat);
  let recipient = null;
  if (chat.participants && currentUserId) {
    recipient = chat.participants.find(
      p => (p.user?._id || p.user || p._id) !== currentUserId
    );
  }
  const displayName =
    recipient?.user?.username ||
    recipient?.user?.name ||
    recipient?.username ||
    recipient?.name ||
    chat.name ||
    'Không xác định';
  const avatarUrl =
    recipient?.user?.profilePicture ||
    recipient?.profilePicture ||
    chat.avatar;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`} />
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-foreground">{displayName}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getStatusText(chat.status)}
            </Badge>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDeleteChat} variant="destructive">
            Xóa hội thoại
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchiveChat}>
            Archive hội thoại
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader; 