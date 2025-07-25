import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import EmojiPicker from './EmojiPicker';
import { Pencil, Undo2, Reply } from 'lucide-react';

const ChatMessage = ({ message, isOwn, showAvatar, showTime, formatTime, onEdit, onRecall, onReply, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(message.content);
    const [showActions, setShowActions] = useState(false);

    // Lấy thông tin sender
    const getSenderInfo = () => {
        if (isOwn) {
            return {
                name: currentUser?.username || currentUser?.name || 'Bạn',
                avatar: currentUser?.profilePicture || currentUser?.avatar
            };
        }
        return {
            name: message.senderName || message.sender?.username || message.sender?.name || 'Người dùng',
            avatar: message.senderAvatar || message.sender?.profilePicture || message.sender?.avatar
        };
    };

    const senderInfo = getSenderInfo();

    // Kiểm tra có thể edit không (chỉ cho phép trong 5 phút, là tin nhắn của mình, chưa recall)
    const canEdit = isOwn && !message.recalled && (Date.now() - new Date(message.timestamp || message.createdAt).getTime() < 5 * 60 * 1000);
    // Có thể recall nếu là của mình và chưa recall
    const canRecall = isOwn && !message.recalled;

    // Hiển thị trạng thái recall
    if (message.recalled) {
        return (
            <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}>
                {showAvatar && !isOwn && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={senderInfo.avatar} alt={senderInfo.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {senderInfo.name?.charAt(0).toUpperCase()}
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
                {showAvatar && !isOwn && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={senderInfo.avatar} alt={senderInfo.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {senderInfo.name?.charAt(0).toUpperCase()}
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
            {showAvatar && !isOwn && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={senderInfo.avatar} alt={senderInfo.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {senderInfo.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    style={{ position: 'relative' }}>
                    <div
                        className={`px-4 py-2 rounded-2xl ${isOwn
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted text-foreground rounded-bl-md'
                            } relative group`}
                    >
                        {/* Reply preview */}
                        {message.replyTo && (
                          <div className="mb-1 px-3 py-2 rounded bg-gray-100 text-gray-800 border-l-4 border-blue-400 text-sm max-w-xs">
                            <span className="font-semibold">{message.replyTo.senderName}:</span>{' '}
                            {Array.isArray(message.replyTo.attachments) && message.replyTo.attachments.length > 0 ? (
                              <span className="flex gap-2 items-center mt-1">
                                {message.replyTo.attachments.map((att, idx) =>
                                  att.type === 'image' ? (
                                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={att.url}
                                        alt={att.filename || 'image'}
                                        className="inline-block w-12 h-12 object-cover rounded border border-gray-200 shadow-sm mr-2"
                                      />
                                    </a>
                                  ) : (
                                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                                      {att.filename || att.url}
                                    </a>
                                  )
                                )}
                              </span>
                            ) : message.replyTo.type === 'image' && message.replyTo.attachments && message.replyTo.attachments.length === 0 && message.replyTo.content ? (
                              // Trường hợp cũ: type là image nhưng không có attachments, fallback về content nếu là link ảnh
                              <img src={message.replyTo.content} alt="image" className="inline-block w-12 h-12 object-cover rounded border border-gray-200 shadow-sm mr-2" />
                            ) : (
                              <span className="truncate">{message.replyTo.content}</span>
                            )}
                          </div>
                        )}
                        {/* Nội dung tin nhắn */}
                        {Array.isArray(message.attachments) && message.attachments.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {message.attachments.map((att, idx) =>
                              att.type === 'image' ? (
                                <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={att.url}
                                    alt={att.filename || 'image'}
                                    className="max-w-xs max-h-60 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                                  />
                                </a>
                              ) : (
                                <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                                  {att.filename || att.url}
                                </a>
                              )
                            )}
                          </div>
                        ) : (
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        )}
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
                            </div>
                        )}
                    </div>
                    {/* Thời gian và trạng thái gửi */}
                    {showTime && (
                        <div className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp || message.createdAt)}
                            </span>
                            {isOwn && message.status && (
                                <span className="text-xs text-muted-foreground">{message.status}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage; 