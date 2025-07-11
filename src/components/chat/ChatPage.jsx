import React, { useState, useEffect, useCallback } from 'react';
import ChatList from './ChatList';
import ChatContainer from './ChatContainer';
import Header from '../Header';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useChatSocket from '../../hooks/useChatSocket';
import { getMessages, getConversations, sendMessage as sendMessageApi } from '../../api/chat';
import { getUsers } from '../../api/user';
import { useToast } from '../../context/ToastContext';
import { createConversation } from '../../api/chat';
import { useAuth } from '../../hooks/useAuth';

const ChatPage = () => {
  const { user: currentUser } = useAuth();
  console.log('currentUser', currentUser);
  const { showToast } = useToast();
  const showErrorToast = useCallback((msg) => showToast(msg, { type: 'error' }), [showToast]);

  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorChats, setErrorChats] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [justCreatedConv, setJustCreatedConv] = useState(false);

  // Lấy danh sách hội thoại khi load trang (chỉ chạy 1 lần khi mount)
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoadingChats(true);
      setErrorChats(null);
      try {
        const res = await getConversations();
        setChats(res.data.conversations || []);
      } catch (error) {
        console.log(error)
        setErrorChats('Không thể tải danh sách hội thoại');
        showErrorToast('Không thể tải danh sách hội thoại');
      } finally {
        setIsLoadingChats(false);
      }
    };
    fetchConversations();
  }, [showErrorToast]);

  const socket = useChatSocket({
    onNewMessage: (msg) => {
      if (msg.conversation === selectedChat?.id) {
        setMessages(prev => {
          if (msg.tempId) {
            return prev.map(m => m.tempId === msg.tempId ? msg : m);
          }
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    },
    onMessageEdited: (msg) => {
      if (msg.conversation === selectedChat?.id) {
        setMessages(prev => prev.map(m => m._id === msg._id ? msg : m));
      }
    },
    onMessageDeleted: ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    },
  });

  // join room và fetch messages
  const chatId = selectedChat?.id || selectedChat?._id;
  useEffect(() => {
    const currentSocket = socket;
    console.log('useEffect fetch messages', selectedChat);
    // Chỉ fetch khi đã có id thực sự
    if (!chatId) return;
    if (justCreatedConv) {
      setJustCreatedConv(false);
      return;
    }
    if (currentSocket) currentSocket.emit('conversation:join', { conversationId: chatId });
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setErrorMessages(null);
      try {
        const res = await getMessages(chatId);
        setMessages(res.data.messages || []);
      } catch {
        setMessages([]);
        setErrorMessages('Không thể tải tin nhắn');
        showErrorToast('Không thể tải tin nhắn');
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
    return () => {
      if (currentSocket) currentSocket.emit('conversation:leave', { conversationId: chatId });
    };
  }, [chatId, showErrorToast, justCreatedConv]);

  // Gửi tin nhắn qua socket, fallback sang REST nếu socket chưa sẵn sàng
  const handleSendMessage = async (messageData) => {
    // Nếu là conversation tạm thời (chưa có id)
    if (selectedChat && !selectedChat.id && !selectedChat._id && selectedChat.isTemp) {
      try {
        // Tạo conversation mới trên server
        const res = await createConversation(selectedChat.participants[0].user._id || selectedChat.participants[0].user);
        const newConv = res.data.conversation || res.data;
        console.log('handleSendMessage: newConv', newConv);
        // Chỉ cập nhật state nếu id thực sự khác
        if ((selectedChat._id !== newConv._id) && (selectedChat.id !== newConv.id)) {
          setChats(prev => {
            const exists = prev.find(c => (c._id || c.id) === (newConv._id || newConv.id));
            if (!exists) return [newConv, ...prev];
            return prev;
          });
          console.log('handleSendMessage: setSelectedChat(newConv)', newConv);
          setSelectedChat(newConv);
        }
        // Gửi message đầu tiên vào conversation mới
        const sentMsg = await sendMessageApi({
          conversationId: newConv._id || newConv.id,
          content: messageData.content,
          type: messageData.type || 'text',
          replyTo: messageData.replyTo,
        });
        setMessages([{ ...sentMsg.data.message, status: 'sent' }]);
        setJustCreatedConv(true);
      } catch {
        showErrorToast('Không thể tạo hội thoại mới hoặc gửi tin nhắn');
      }
      setReplyingMessage(null);
      return;
    }
    if (socket && selectedChat) {
      const tempId = Date.now().toString();
      const msg = {
        ...messageData,
        conversationId: selectedChat.id || selectedChat._id,
        tempId,
      };
      setMessages(prev => [...prev, { ...msg, status: 'sending' }]);
      socket.emit('message:send', msg, (response) => {
        if (!response.success) {
          setMessages(prev => prev.filter(m => m.tempId !== tempId));
          showErrorToast('Không thể gửi tin nhắn');
        }
      });
      setReplyingMessage(null);
    } else if (selectedChat) {
      try {
        setIsLoadingMessages(true);
        await sendMessageApi({
          conversationId: selectedChat.id || selectedChat._id,
          content: messageData.content,
          type: messageData.type || 'text',
          replyTo: messageData.replyTo,
        });
        const res = await getMessages(selectedChat.id || selectedChat._id);
        setMessages(res.data.messages || []);
      } catch {
        setErrorMessages('Không thể gửi tin nhắn');
        showErrorToast('Không thể gửi tin nhắn');
      } finally {
        setIsLoadingMessages(false);
      }
      setReplyingMessage(null);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setChats(prevChats => 
      prevChats.map(c => 
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const handleTyping = (text) => {
    setIsTyping(text.length > 0);
  };

  // Khi bấm dấu cộng, fetch danh sách user
  const handleStartNewChat = async () => {
    setIsUserModalOpen(true);
    setIsLoadingUsers(true);
    try {
      const data = await getUsers();
      setAllUsers(data || []);
    } catch {
      showErrorToast('Không thể tải danh sách người dùng');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSelectUser = (user) => {
    // Kiểm tra đã có conversation với user chưa
    let chat = chats.find(c => c.participants
      ? c.participants.some(p => p._id === user._id)
      : c.id === user._id // fallback cho trường hợp cũ
    );
    if (chat) {
      // Chỉ setSelectedChat nếu id khác
      if (!selectedChat || (selectedChat.id !== chat.id && selectedChat._id !== chat._id)) {
        console.log('handleSelectUser: setSelectedChat(chat)', chat);
        setSelectedChat(chat);
      }
      setIsUserModalOpen(false);
    } else {
      // Tạo conversation tạm thời (participants: [{ user }])
      const tempChat = {
        id: null,
        _id: null,
        participants: [{ user }],
        isTemp: true,
        lastMessage: null,
        unreadCount: 0,
        isPinned: false
      };
      console.log('handleSelectUser: setSelectedChat(tempChat)', tempChat);
      setSelectedChat(tempChat);
      setIsUserModalOpen(false);
    }
  };

  const retryConversations = async () => {
    setIsLoadingChats(true);
    setErrorChats(null);
    try {
      const res = await getConversations();
      setChats(res.data.conversations || []);
    } catch {
      setErrorChats('Không thể tải danh sách hội thoại');
      showErrorToast('Không thể tải danh sách hội thoại');
    } finally {
      setIsLoadingChats(false);
    }
  };
  const retryMessages = async () => {
    if (!selectedChat) return;
    setIsLoadingMessages(true);
    setErrorMessages(null);
    try {
      const res = await getMessages(selectedChat.id);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
      setErrorMessages('Không thể tải tin nhắn');
      showErrorToast('Không thể tải tin nhắn');
    } finally {
      setIsLoadingMessages(false);
    }
  };


  return (
    <div className="h-screen flex flex-col bg-muted">
      <Header />
      <div className="flex flex-1 min-h-0 max-w-7xl mx-auto w-full gap-4 px-2 md:px-6 py-4">
        {/* Chat List Sidebar */}
        <div className="w-80 flex-shrink-0 rounded-xl bg-white border shadow-sm h-full flex flex-col min-h-0 p-2 md:p-4">
          {isLoadingChats ? (
            <div className="flex-1 flex flex-col gap-2 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded mb-2" />
              ))}
            </div>
          ) : errorChats ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-2">
              <span>{errorChats}</span>
              <button onClick={retryConversations} className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80">Thử lại</button>
            </div>
          ) : (
            <ChatList
              chats={chats}
              selectedChatId={selectedChat?.id}
              onSelectChat={handleSelectChat}
              onSearch={handleSearch}
              isLoading={isLoading}
              onStartNewChat={handleStartNewChat}
            />
          )}
        </div>
        {/* Chat Container */}
        <div className="flex-1 min-w-0 rounded-xl bg-white border shadow-sm h-full flex flex-col p-2 md:p-4">
          {isLoadingMessages ? (
            <div className="flex-1 flex flex-col gap-2 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded mb-2 w-2/3" />
              ))}
            </div>
          ) : errorMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-2">
              <span>{errorMessages}</span>
              <button onClick={retryMessages} className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80">Thử lại</button>
            </div>
          ) : (
            <ChatContainer
              selectedChat={selectedChat}
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isLoading}
              currentUser={currentUser}
              isTyping={isTyping}
              onTyping={handleTyping}
              replyingMessage={replyingMessage}
              onCancelReply={() => setReplyingMessage(null)}
              onReply={msg => setReplyingMessage(msg)}
            />
          )}
        </div>
      </div>
      {/* Modal chọn user */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent showCloseButton>
          <DialogTitle>Bắt đầu cuộc trò chuyện mới</DialogTitle>
          <input
            type="text"
            className="w-full mt-4 mb-2 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 text-base"
            placeholder="Tìm kiếm người dùng..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            autoFocus
          />
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoadingUsers ? (
              <div className="text-center py-4 text-gray-500">Đang tải danh sách người dùng...</div>
            ) : allUsers.filter(user =>
              user._id !== currentUser._id &&
              user.username && user.username.toLowerCase().includes(userSearch.toLowerCase())
            ).map(user => (
              <button
                key={user._id}
                className="flex items-center gap-3 w-full p-2 rounded hover:bg-accent transition-colors"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-base text-left">{user.username}</span>
                {user.isOnline && <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block"></span>}
              </button>
            ))}
            {!isLoadingUsers && allUsers.filter(user =>
              user._id !== currentUser._id &&
              user.username && user.username.toLowerCase().includes(userSearch.toLowerCase())
            ).length === 0 && (
              <div className="text-center text-muted-foreground py-4">Không tìm thấy người dùng</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage; 