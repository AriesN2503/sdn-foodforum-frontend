import React from 'react';

const ChatMessagesSkeleton = () => {
    return (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Date separator skeleton */}
            <div className="flex items-center justify-center">
                <div className="bg-muted px-3 py-1 rounded-full w-32 h-6 animate-pulse"></div>
            </div>
            
            {/* Message skeletons */}
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                    {/* Avatar skeleton */}
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0"></div>
                    
                    {/* Message content skeleton */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-3/4 h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-1/2 h-4 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Another date separator */}
            <div className="flex items-center justify-center">
                <div className="bg-muted px-3 py-1 rounded-full w-32 h-6 animate-pulse"></div>
            </div>
            
            {/* More message skeletons */}
            {[...Array(3)].map((_, index) => (
                <div key={`second-${index}`} className="flex items-start space-x-3 justify-end">
                    {/* Message content skeleton (right aligned for own messages) */}
                    <div className="flex-1 space-y-2 max-w-xs">
                        <div className="space-y-2">
                            <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-2/3 h-4 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatMessagesSkeleton; 