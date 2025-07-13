import axiosClient from './axiosClient';

// Lấy danh sách hội thoại của user
export function getConversations() {
  return axiosClient.get('/conversations');
}

// Lấy chi tiết một hội thoại
export function getConversation(conversationId) {
  return axiosClient.get(`/conversations/${conversationId}`);
}

// Lưu trữ hội thoại
export function archiveConversation(conversationId) {
  return axiosClient.put(`/conversations/${conversationId}`);
}

// Lấy tin nhắn của một hội thoại
export function getMessages(conversationId) {
  return axiosClient.get(`/messages/${conversationId}`);
}

// Gửi tin nhắn (không dùng cho socket, chỉ dùng cho REST fallback)
export function sendMessage({ conversationId, content, type = 'text', replyTo }) {
  return axiosClient.post('/messages', { conversationId, content, type, replyTo });
}

// Tạo hội thoại mới với một user (đúng schema participants)
export function createConversation(userId, firstMessage) {
    return axiosClient.post('/conversations', { participantId: userId, firstMessage });
}
