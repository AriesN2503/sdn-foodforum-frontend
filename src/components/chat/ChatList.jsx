import React, { useState, useContext } from 'react';
import { Input } from '../ui/input';
import ChatListItem from './ChatListItem';
import { AuthContext } from '../../context/AuthContext';

const ChatList = ({ 
  chats = [], 
  selectedChatId, 
  onSelectChat, 
  onSearch,
  isLoading = false,
  onStartNewChat, // thêm prop này
  onShowActive,
  onShowArchived,
  currentTab = 'active' // 'active' hoặc 'archived'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };
  console.log(chats)

  const filteredChats = chats;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="p-4 border-b">
          <div className="relative flex items-center gap-2">
            <Input placeholder="Tìm kiếm cuộc trò chuyện..." disabled />
            <button
              type="button"
              className="ml-2 p-2 rounded-full hover:bg-accent transition-colors"
              title="Bắt đầu cuộc trò chuyện mới"
              onClick={onStartNewChat}
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            className={`p-2 rounded-full hover:bg-accent transition-colors ${currentTab === 'active' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            title="Hội thoại đang hoạt động"
            onClick={onShowActive}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button
            type="button"
            className={`p-2 rounded-full hover:bg-accent transition-colors ${currentTab === 'archived' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            title="Hội thoại đã lưu trữ"
            onClick={onShowArchived}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
            </svg>
          </button>
          <div className="flex-1" />
          <button
            type="button"
            className="p-2 rounded-full hover:bg-accent transition-colors"
            title="Bắt đầu cuộc trò chuyện mới"
            onClick={onStartNewChat}
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm">
                {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
              </p>
              {!searchQuery && (
                <p className="text-xs">Bắt đầu trò chuyện với người khác</p>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat._id || chat.id}
                chat={chat}
                isSelected={selectedChatId === (chat._id || chat.id)}
                onClick={() => onSelectChat(chat)}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList; 