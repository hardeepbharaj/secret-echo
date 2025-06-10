import axios from 'axios';
import { MessagesResponse, SendMessageResponse } from '@/types/messages';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const messagesApi = {
  getMessages: async (token: string): Promise<MessagesResponse> => {
    const response = await axios.get(`${API_URL}/api/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  sendMessage: async (token: string, content: string): Promise<SendMessageResponse> => {
    const response = await axios.post(
      `${API_URL}/api/messages`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}; 