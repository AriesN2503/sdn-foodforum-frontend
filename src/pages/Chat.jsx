import React from 'react';
import ChatPage from '../components/chat/ChatPage';

const Chat = () => {
  // Mock current user data
  const currentUser = {
    id: 'current-user',
    name: 'Bạn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'user@example.com'
  };

  return (
    <div className="h-screen bg-background">
      <ChatPage currentUser={currentUser} />
    </div>
  );
};

export default Chat; 