# Chat UI Components cho Food Forum

## Tổng quan

Đây là bộ UI components hoàn chỉnh cho tính năng chat real-time trong Food Forum. UI được thiết kế với phong cách hiện đại, responsive và hài hòa với design system hiện có.

## Các Components chính

### 1. ChatPage
Component chính kết hợp tất cả các thành phần chat.

**Props:**
- `currentUser`: Thông tin user hiện tại

**Features:**
- Quản lý state cho chats, messages
- Xử lý logic gửi/nhận tin nhắn
- Mock data cho demo

### 2. ChatContainer
Container chính hiển thị khu vực chat.

**Props:**
- `selectedChat`: Chat được chọn
- `onSendMessage`: Callback khi gửi tin nhắn
- `messages`: Danh sách tin nhắn
- `isLoading`: Trạng thái loading
- `currentUser`: User hiện tại

### 3. ChatHeader
Header hiển thị thông tin người chat.

**Features:**
- Avatar với status indicator
- Tên và trạng thái online/offline
- Các action buttons (call, video, menu)

### 4. ChatMessages
Danh sách tin nhắn với grouping theo ngày.

**Features:**
- Group tin nhắn theo ngày
- Loading state
- Empty state
- Auto scroll to bottom

### 5. ChatMessage
Component hiển thị từng tin nhắn.

**Features:**
- Hỗ trợ text, image, file
- Message status (sent, delivered, read)
- Reply to message
- Avatar chỉ hiển thị khi cần

### 6. ChatInput
Input để nhập và gửi tin nhắn.

**Features:**
- Text input với emoji picker
- Upload hình ảnh và file
- Typing indicator
- Enter để gửi, Shift+Enter để xuống dòng

### 7. ChatList
Danh sách các cuộc trò chuyện.

**Features:**
- Search functionality
- Unread count badge
- Pinned chat indicator
- Last message preview

### 8. ChatListItem
Item trong danh sách chat.

**Features:**
- Avatar với status
- Tên và thời gian
- Preview tin nhắn cuối
- Unread count

### 9. ChatNotification
Thông báo tin nhắn mới.

**Features:**
- Toast notification
- Preview tin nhắn
- Click để mở chat
- Auto dismiss

### 10. EmojiPicker
Picker để chọn emoji.

**Features:**
- Categories: smileys, gestures, food, activities
- Grid layout
- Search (có thể mở rộng)

## Cách sử dụng

### 1. Thêm route
```jsx
// Trong AppRoutes.jsx
import Chat from "../pages/Chat"

<Route path="chat" element={<Chat />} />
```

### 2. Sử dụng trong component
```jsx
import ChatPage from '../components/ChatPage';

const MyComponent = () => {
  const currentUser = {
    id: 'user-1',
    name: 'User Name',
    avatar: 'avatar-url'
  };

  return <ChatPage currentUser={currentUser} />;
};
```

### 3. Tích hợp với API
```jsx
// Thay thế mock data bằng API calls
const [chats, setChats] = useState([]);

useEffect(() => {
  // Fetch chats from API
  fetchChats().then(setChats);
}, []);

const handleSendMessage = async (messageData) => {
  // Send message to API
  const response = await sendMessage(messageData);
  // Update UI
};
```

## Data Structure

### Chat Object
```javascript
{
  id: string,
  name: string,
  avatar: string,
  status: 'online' | 'offline' | 'away',
  lastSeen: string,
  lastMessage: {
    content: string,
    timestamp: string,
    type: 'text' | 'image' | 'file'
  },
  unreadCount: number,
  isPinned: boolean
}
```

### Message Object
```javascript
{
  id: string,
  content: string,
  timestamp: string,
  type: 'text' | 'image' | 'file',
  senderId: string,
  senderName: string,
  senderAvatar: string,
  status: 'sent' | 'delivered' | 'read',
  replyTo?: {
    content: string,
    senderName: string
  },
  fileName?: string, // for file type
  fileSize?: string  // for file type
}
```

## Styling

UI sử dụng Tailwind CSS với design system có sẵn:
- Colors: primary, secondary, muted, accent
- Spacing: consistent padding/margin
- Typography: responsive text sizes
- Shadows: subtle elevation
- Transitions: smooth animations

## Responsive Design

- Mobile: Stack layout
- Tablet: Sidebar + main content
- Desktop: Full layout với sidebar

## Accessibility

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
- Color contrast compliance

## Performance

- Virtual scrolling cho large message lists
- Lazy loading cho images
- Debounced search
- Optimized re-renders

## Future Enhancements

1. **Real-time features:**
   - WebSocket integration
   - Typing indicators
   - Read receipts
   - Online status

2. **Advanced features:**
   - Message reactions
   - Message editing/deletion
   - File sharing
   - Voice messages
   - Video calls

3. **UI improvements:**
   - Dark mode support
   - Custom themes
   - Message animations
   - Drag & drop files

## Testing

```bash
# Run tests
npm test

# Test specific component
npm test ChatMessage
```

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Test on different screen sizes
5. Ensure accessibility compliance 