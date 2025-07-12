import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import EmojiPicker from './EmojiPicker';
import { Pencil, Undo2, Reply } from 'lucide-react';

const ChatMessage = ({ message, isOwn, showAvatar, showTime, formatTime, onEdit, onRecall, onReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [showActions, setShowActions] = useState(false);

  // Kiểm tra có thể edit không (chỉ cho phép trong 5 phút, là tin nhắn của mình, chưa recall)
  const canEdit = isOwn && !message.recalled && (Date.now() - new Date(message.timestamp).getTime() < 5 * 60 * 1000);
  // Có thể recall nếu là của mình và chưa recall
  const canRecall = isOwn && !message.recalled;

  // Hiển thị trạng thái recall
  if (message.recalled) {
    return (
      <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}>
        {showAvatar && isOwn && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={message.senderAvatar} alt={message.senderName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {message.senderName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div className={`px-4 py-2 rounded-2xl bg-muted text-muted-foreground italic text-sm border border-dashed border-gray-300`}>
            Tin nhắn này đã được thu hồi
          </div>
        </div>
      </div>
    );
  }

  // Đang chỉnh sửa
  if (isEditing) {
    return (
      <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}>
        {showAvatar && isOwn && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={message.senderAvatar} alt={message.senderName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {message.senderName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary`}>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              autoFocus
            />
            <button className="text-xs text-primary font-semibold px-2" onClick={() => { setIsEditing(false); onEdit?.(message, editValue); }}>Lưu</button>
            <button className="text-xs text-muted-foreground px-2" onClick={() => { setIsEditing(false); setEditValue(message.content); }}>Hủy</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}>
      {showAvatar && isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {message.senderName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          style={{ position: 'relative' }}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md'
            } relative group`}
          >
            {/* Reply preview */}
            {message.replyTo && (
              <div className="mb-1 px-3 py-2 rounded bg-gray-100 text-gray-800 border-l-4 border-blue-400 text-sm">
                <span className="font-semibold">{message.replyTo.senderName}:</span> {message.replyTo.content}
              </div>
            )}
            {/* Nội dung tin nhắn */}
            {message.type === 'image' ? (
              <a href={message.content} target="_blank" rel="noopener noreferrer">
                <img
                  src={message.content}
                  alt={message.fileName || 'image'}
                  className="max-w-xs max-h-60 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                />
              </a>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}
            {/* Reaction list */}
            {/* Bỏ phần hiển thị reaction list */}
            {/* Action icons khi hover */}
            {showActions && (
              <div className={`absolute top-1/2 ${isOwn ? 'right-full -translate-x-2' : 'left-full translate-x-2'} -translate-y-1/2 flex gap-1 bg-white/90 rounded shadow p-1 z-10`}>
                {canEdit && (
                  <button className="p-1 hover:bg-accent rounded" title="Chỉnh sửa" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </button>
                )}
                {canRecall && (
                  <button className="p-1 hover:bg-accent rounded" title="Thu hồi" onClick={() => onRecall?.(message)}>
                    <Undo2 className="w-4 h-4 text-gray-700" />
                  </button>
                )}
                <button className="p-1 hover:bg-accent rounded" title="Phản hồi" onClick={() => onReply?.(message)}>
                  <Reply className="w-4 h-4 text-gray-700" />
                </button>
                {/* Bỏ nút reaction (Smile) trong action icons */}
              </div>
            )}
          </div>
          {/* Thời gian và trạng thái gửi */}
          {showTime && (
            <div className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
              {isOwn && message.status && (
                <span className="text-xs text-muted-foreground">{message.status}</span>
              )}
            </div>
          )}
        </div>
        {/* Reply preview ở ngoài (nếu muốn) */}
        {/* ĐÃ XOÁ PHẦN NÀY ĐỂ TRÁNH HIỂN THỊ HAI LẦN */}
      </div>
    </div>
  );
};

export default ChatMessage; 