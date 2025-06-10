'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Message } from '@/types/messages';
import { apiClient } from '@/lib/api/client';
import type { ApiError } from '@/types/api';

export default function ChatPage() {
  const { logout, user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const bottomElement = document.getElementById('chat-bottom');
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = Cookies.get('token');
    if (!token) {
      logout();
      return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('error', (error: { message: string }) => {
      setError(error.message);
      if (error.message === 'Authentication error') {
        logout();
      }
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      if (message.isAiResponse) {
        setIsLoading(false);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, user, logout, scrollToBottom]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiClient.get<{ data: { messages: Message[] } }>('/messages');
      setMessages(response.data.data.messages);
      scrollToBottom();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.response?.status === 401) {
        logout();
      } else {
        setError(apiError.response?.data?.message || 'Failed to fetch messages');
      }
    }
  }, [logout, scrollToBottom]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText || !socket) return;

    setNewMessage('');
    setIsLoading(true);
    setError('');

    try {
      socket.emit('sendMessage', { content: messageText });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to send message');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
              {user && (
                <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                  {user.username}
                </span>
              )}
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div 
          id="chat-messages" 
          className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth max-w-3xl mx-auto"
          style={{ 
            maxHeight: 'calc(100vh - 180px)',
            scrollBehavior: 'smooth'
          }}
        >
          {error && (
            <div className="text-center text-red-500 mb-4">
              {error}
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex items-center ${message.isAiResponse ? 'justify-start space-x-3' : 'justify-end space-x-3'}`}
              >
                {message.isAiResponse && <Avatar isAi />}
                <div
                  className={`p-4 rounded-2xl max-w-[80%] ${
                    message.isAiResponse
                      ? 'bg-white shadow-sm'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className={`text-[15px] ${message.isAiResponse ? 'text-gray-800' : 'text-white'}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${message.isAiResponse ? 'text-gray-500' : 'text-blue-100'}`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {!message.isAiResponse && <Avatar username={user?.username} />}
              </div>
            ))
          )}
          {/* Show loading indicator only when waiting for AI response */}
          {isLoading && messages.length > 0 && !messages[messages.length - 1].isAiResponse && (
            <div className="flex items-center space-x-3">
              <Avatar isAi />
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div id="chat-bottom" />
        </div>
      </div>

      <div className="bg-white border-t py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading || !socket}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !socket || !newMessage.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 