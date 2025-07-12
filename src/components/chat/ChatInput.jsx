import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ChatInput = ({ onSendMessage, isTyping = false, onTyping, replyingMessage, onCancelReply }) => {
  const [message, setMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (replyingMessage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingMessage]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage({
        type: 'text',
        content: message.trim(),
        timestamp: new Date().toISOString()
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSendMessage({
          type: 'file',
          content: e.target.result,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          timestamp: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    }
    setIsAttaching(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSendMessage({
          type: 'image',
          content: e.target.result,
          fileName: file.name,
          timestamp: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    }
    setIsAttaching(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-card p-4">
      {replyingMessage && (
        <div className="mb-2 p-2 rounded bg-muted flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Replying to {replyingMessage.senderName}</div>
            <div className="text-xs text-muted-foreground truncate max-w-xs">{replyingMessage.content}</div>
          </div>
          <button className="ml-2 p-1 rounded hover:bg-accent" onClick={onCancelReply} title="Hủy phản hồi">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {isTyping && (
        <div className="mb-2 text-xs text-muted-foreground">
          <span className="animate-pulse">Đang nhập...</span>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping?.(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="pr-12 resize-none"
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-1 rounded hover:bg-accent transition-colors"
              title="Gửi hình ảnh"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded hover:bg-accent transition-colors"
              title="Gửi file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        </div>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="icon"
          className="flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
      
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ChatInput; 