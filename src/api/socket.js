import { io } from 'socket.io-client';

let socket = null;

export function connectSocket() {
    const token = JSON.parse(localStorage.getItem("foodforum_auth"))?.token;

    if (!token) return null;

    if (socket && socket.connected) return socket;

    socket = io('http://localhost:8080', {
        auth: { token },
        transports: ['websocket'],
        path: '/socket.io',
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
    return socket;
}

export { socket }; 