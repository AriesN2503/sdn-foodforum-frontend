import axiosClient from './axiosClient';

// Lấy danh sách hội thoại của user
export function getConversations() {
  return axiosClient.get('/conversations');
}
// Lấy danh sách hội thoại đã lưu trữ
export function getArchivedConversations() {
  return axiosClient.get('/conversations/archived/list');
}

// Lấy chi tiết một hội thoại
export function getConversation(conversationId) {
  return axiosClient.get(`/conversations/${conversationId}`);
}

// Lưu trữ hội thoại
export function archiveConversation(conversationId) {
  return axiosClient.patch(`/conversations/${conversationId}/archive`);
}

// Khôi phục hội thoại
export function restoreConversation(conversationId) {
  return axiosClient.patch(`/conversations/${conversationId}/restore`);
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

// Cập nhật tin nhắn (edit message)
export function updateMessage(messageId, content) {
  return axiosClient.put(`/messages/${messageId}`, { content });
}

// Xóa hội thoại
export function deleteConversation(conversationId) {
  return axiosClient.delete(`/conversations/${conversationId}`);
}

// Lấy danh sách hội thoại theo trạng thái active
export function getConversationsByActive(isActive) {
  return axiosClient.get(`/conversations?active=${isActive}`);
}
