import React from 'react';

const ChatHeaderSkeleton = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-between p-4 border-b bg-card animate-pulse ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-200 rounded-full border-2 border-white"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ChatHeaderSkeleton; 