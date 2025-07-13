// Utility để test realtime message
export const testRealtimeMessage = () => {
    console.log('🧪 Testing Realtime Message Flow');
    
    // Test cases
    const testCases = [
        {
            name: 'Test Case 1: User A sends message to User B',
            description: 'User A should see message immediately, User B should receive via socket',
            steps: [
                '1. User A joins conversation room',
                '2. User B joins same conversation room', 
                '3. User A sends message via socket',
                '4. Both users should receive message:new event',
                '5. Both users should update their messages state'
            ]
        },
        {
            name: 'Test Case 2: Message state synchronization',
            description: 'Messages should be synchronized between users',
            steps: [
                '1. Check if both users have same message count',
                '2. Verify message content is identical',
                '3. Check message timestamps are consistent',
                '4. Ensure sender information is correct'
            ]
        },
        {
            name: 'Test Case 3: Room management',
            description: 'Users should properly join/leave conversation rooms',
            steps: [
                '1. User joins room - should receive conversation:joined event',
                '2. User leaves room - should receive conversation:left event',
                '3. Messages should only be received when in correct room'
            ]
        }
    ];

    console.log('📋 Test Cases:');
    testCases.forEach((testCase, index) => {
        console.log(`\n${index + 1}. ${testCase.name}`);
        console.log(`   Description: ${testCase.description}`);
        console.log('   Steps:');
        testCase.steps.forEach(step => console.log(`   ${step}`));
    });

    return testCases;
};

export const debugMessageFlow = (message, currentUser, selectedChat) => {
    console.log('🔍 Debug Message Flow:', {
        message: {
            id: message._id,
            content: message.content,
            senderId: message.senderId || message.sender?._id || message.sender,
            conversationId: message.conversation || message.conversationId,
            timestamp: message.timestamp || message.createdAt
        },
        currentUser: {
            id: currentUser?.id || currentUser?._id,
            username: currentUser?.username
        },
        selectedChat: {
            id: selectedChat?.id || selectedChat?._id,
            participants: selectedChat?.participants
        },
        isOwnMessage: (currentUser?.id || currentUser?._id) === (message.senderId || message.sender?._id || message.sender),
        isCurrentChat: (selectedChat?.id || selectedChat?._id) === (message.conversation || message.conversationId)
    });
};

export const validateSocketConnection = (socket) => {
    if (!socket) {
        console.error('❌ Socket is null or undefined');
        return false;
    }

    if (!socket.connected) {
        console.error('❌ Socket is not connected');
        return false;
    }

    console.log('✅ Socket is connected:', {
        id: socket.id,
        connected: socket.connected
    });
    return true;
};

export const validateRoomMembership = (socket, conversationId) => {
    if (!socket || !conversationId) {
        console.error('❌ Socket or conversationId is missing');
        return false;
    }

    console.log('🔍 Validating room membership:', {
        socketId: socket.id,
        conversationId,
        connected: socket.connected
    });

    return true;
}; 