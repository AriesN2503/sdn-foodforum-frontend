import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Search, Archive, Trash2, Users } from 'lucide-react';
import { useChatHeader } from '../../hooks/useChatHeader';
import ChatHeaderSkeleton from './ChatHeaderSkeleton';

const ChatHeader = React.memo(({ 
  chat, 
  onDeleteChat, 
  onArchiveChat, 
  onViewProfile,
  currentUserId,
  isLoading = false,
  className = ""
}) => {
    const { chatInfo } = useChatHeader(chat, currentUserId);

    // Memoize action handlers
    const handleDeleteChat = useCallback(() => {
        if (onDeleteChat) {
            onDeleteChat(chat);
        }
    }, [onDeleteChat, chat]);

    const handleArchiveChat = useCallback(() => {
        if (onArchiveChat) {
            onArchiveChat(chat);
        }
    }, [onArchiveChat, chat]);

    

    const handleViewProfile = useCallback(() => {
        if (onViewProfile && chatInfo.userId) {
            onViewProfile(chatInfo.userId);
        }
    }, [onViewProfile, chatInfo.userId]);

    if (isLoading) {
        return <ChatHeaderSkeleton className={className} />;
    }

    return (
        <div className={`flex items-center justify-between p-4 border-b bg-card ${className}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                    <Avatar className="w-10 h-10 ring-2 ring-white">
                        <AvatarImage
                            src={chatInfo.avatarUrl}
                            alt={chatInfo.displayName}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {chatInfo.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${chatInfo.statusConfig.color}`}
                        title={chatInfo.statusConfig.text}
                    />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <h3
                        className="font-semibold text-foreground truncate"
                        title={chatInfo.displayName}
                    >
                        {chatInfo.displayName}
                    </h3>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="text-xs"
                            title={chatInfo.statusConfig.text}
                        >
                            {chatInfo.statusConfig.text}
                        </Badge>
                        {chatInfo.isGroupChat && (
                            <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {chatInfo.participantCount}
                            </Badge>
                        )}
                        {chatInfo.isPinned && (
                            <Badge variant="outline" className="text-xs">
                                📌 Ghim
                            </Badge>
                        )}
                        {chatInfo.hasUnreadMessages && (
                            <Badge variant="destructive" className="text-xs">
                                Mới
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

           
        </div>
    );
});

ChatHeader.propTypes = {
    chat: PropTypes.shape({
        id: PropTypes.string,
        _id: PropTypes.string,
        name: PropTypes.string,
        avatar: PropTypes.string,
        status: PropTypes.string,
        isPinned: PropTypes.bool,
        unreadCount: PropTypes.number,
        participants: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string,
            user: PropTypes.shape({
                _id: PropTypes.string,
                username: PropTypes.string,
                name: PropTypes.string,
                profilePicture: PropTypes.string,
                status: PropTypes.string
            })
        })),
        lastMessage: PropTypes.shape({
            createdAt: PropTypes.string
        })
    }),
    onDeleteChat: PropTypes.func,
    onArchiveChat: PropTypes.func,
    onViewProfile: PropTypes.func,
    currentUserId: PropTypes.string,
    isLoading: PropTypes.bool,
    className: PropTypes.string
};

ChatHeader.defaultProps = {
    isLoading: false,
    className: ""
};

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader; 


// <div className="flex items-center gap-1 flex-shrink-0">
// {/* Action buttons */}
// <DropdownMenu>
//     <DropdownMenuTrigger asChild>
//         <Button
//             variant="ghost"
//             size="sm"
//             className="h-8 w-8 p-0"
//             title="Tùy chọn"
//             aria-label="Tùy chọn cuộc trò chuyện"
//         >
//             <MoreHorizontal className="h-4 w-4" />
//         </Button>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent align="end" className="w-48">
//         {/* Đã xóa menu item Tìm kiếm tin nhắn */}
//         {!chatInfo.isGroupChat && onViewProfile && (
//             <DropdownMenuItem onClick={handleViewProfile}>
//                 <Users className="mr-2 h-4 w-4" />
//                 Xem hồ sơ
//             </DropdownMenuItem>
//         )}
//         <DropdownMenuSeparator />
//         {chat?.isActive !== false ? (
//             <DropdownMenuItem onClick={handleArchiveChat}>
//                 <Archive className="mr-2 h-4 w-4" />
//                 Lưu trữ hội thoại
//             </DropdownMenuItem>
//         ) : (
//             <DropdownMenuItem onClick={() => onArchiveChat && onArchiveChat(chat, true)}>
//                 <Archive className="mr-2 h-4 w-4" />
//                 Khôi phục hội thoại
//             </DropdownMenuItem>
//         )}
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//             onClick={handleDeleteChat}
//             className="text-red-600 focus:text-red-600"
//         >
//             <Trash2 className="mr-2 h-4 w-4" />
//             Xóa hội thoại
//         </DropdownMenuItem>
//     </DropdownMenuContent>
// </DropdownMenu>
// </div>