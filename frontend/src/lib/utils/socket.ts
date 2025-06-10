import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/messages';

interface SocketEvents {
  message: (data: { type: string; message: Message }) => void;
  typing: (data: { isTyping: boolean }) => void;
  error: (error: { message: string }) => void;
}

export const createSocketConnection = (token: string): Socket<SocketEvents> => {
  const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = (socket: Socket | null) => {
  if (socket) {
    socket.disconnect();
  }
}; 