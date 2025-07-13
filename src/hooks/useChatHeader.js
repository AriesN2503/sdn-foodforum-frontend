import { useMemo, useCallback } from 'react';

export const useChatHeader = (chat, currentUserId) => {
// Memoize status configuration
const statusConfig = useMemo(() => ({
    online: {
        color: 'bg-green-500',
        text: 'Đang hoạt động',
        ring: 'ring-green-500'
    },
    offline: {
        color: 'bg-gray-400',
        text: 'Ngoại tuyến',
        ring: 'ring-gray-400'
    },
    away: {
        color: 'bg-yellow-500',
        text: 'Vắng mặt',
        ring: 'ring-yellow-500'
    },
    busy: {
        color: 'bg-red-500',
        text: 'Bận',
        ring: 'ring-red-500'
    }
}), []);

// Memoize recipient data extraction
const recipientData = useMemo(() => {
    if (!chat?.participants || !currentUserId) {
        return {
            displayName: chat?.name || 'Không xác định',
            avatarUrl: chat?.avatar,
            status: chat?.status || 'offline',
            userId: null
        };
    }

    const recipient = chat.participants.find(
        p => (p.user?._id) !== currentUserId
    );

    if (!recipient) {
        return {
            displayName: chat?.name || 'Không xác định',
            avatarUrl: chat?.avatar,
            status: chat?.status || 'offline',
            userId: null
        };
    }

    return {
        displayName: recipient?.user?.username || 'Không xác định',
        avatarUrl: recipient?.user?.avatar,
        status: recipient?.user?.isOnline ? 'online' : 'offline',
        userId: recipient?.user?._id
    };
}, [chat, currentUserId]);

// Get status configuration
const getStatusConfig = useCallback((status) => {
    return statusConfig[status] || statusConfig.offline;
}, [statusConfig]);

// Check if chat is group chat
const isGroupChat = useMemo(() => {
    return chat?.participants && chat.participants.length > 2;
}, [chat?.participants]);

// Check if user is online
const isOnline = useMemo(() => {
    return recipientData.status === 'online';
}, [recipientData.status]);

// Get chat display info
const chatInfo = useMemo(() => {
    const statusConfigData = getStatusConfig(recipientData.status);

    return {
        ...recipientData,
        statusConfig: statusConfigData,
        isGroupChat,
        isOnline,
        hasUnreadMessages: chat?.unreadCount > 0,
        isPinned: chat?.isPinned || false,
        lastMessageTime: chat?.lastMessage?.createdAt,
        participantCount: chat?.participants?.length || 0
    };
}, [recipientData, getStatusConfig, isGroupChat, isOnline, chat]);

return {
    chatInfo,
    statusConfig,
    getStatusConfig
};
}; 