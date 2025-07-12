import React from 'react';
import { Card, CardContent } from '../ui/card';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatContainer = ({ 
  selectedChat, 
  onSendMessage, 
  messages = [], 
  isLoading = false,
  currentUser,
  replyingMessage,
  onCancelReply,
  onReply
}) => {
  
  if (!selectedChat) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Chọn một cuộc trò chuyện</h3>
              <p className="text-sm">Bắt đầu trò chuyện với người khác</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col min-h-0">
      <ChatHeader chat={selectedChat} />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <ChatMessages 
            messages={messages} 
            currentUser={currentUser}
            isLoading={isLoading}
            onReply={onReply}
            />
      </div>
      <ChatInput onSendMessage={onSendMessage} replyingMessage={replyingMessage} onCancelReply={onCancelReply} />
    </Card>
  );
};

export default ChatContainer; 