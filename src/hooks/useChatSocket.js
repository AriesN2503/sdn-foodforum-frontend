import { useEffect, useRef } from 'react';
import { connectSocket } from '../api/socket';


export default function useChatSocket({
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onTypingStart,
    onTypingStop,
    onUserOnline,
    onUserOffline,
} = {}) {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = connectSocket();
        if (!socket) return;
        socketRef.current = socket;

        // Lắng nghe các event
        if (onNewMessage) socket.on('message:new', onNewMessage);
        if (onMessageEdited) socket.on('message:edited', onMessageEdited);
        if (onMessageDeleted) socket.on('message:deleted', onMessageDeleted);
        if (onTypingStart) socket.on('typing:start', onTypingStart);
        if (onTypingStop) socket.on('typing:stop', onTypingStop);
        if (onUserOnline) socket.on('user:online', onUserOnline);
        if (onUserOffline) socket.on('user:offline', onUserOffline);

        // Cleanup khi unmount
        return () => {
        if (!socket) return;
        if (onNewMessage) socket.off('message:new', onNewMessage);
        if (onMessageEdited) socket.off('message:edited', onMessageEdited);
        if (onMessageDeleted) socket.off('message:deleted', onMessageDeleted);
        if (onTypingStart) socket.off('typing:start', onTypingStart);
        if (onTypingStop) socket.off('typing:stop', onTypingStop);
        if (onUserOnline) socket.off('user:online', onUserOnline);
        if (onUserOffline) socket.off('user:offline', onUserOffline);
        };
    }, [onNewMessage, onMessageEdited, onMessageDeleted, onTypingStart, onTypingStop, onUserOnline, onUserOffline]);

    // Trả về socket instance để dùng emit/join room...
    return socketRef.current;
} 