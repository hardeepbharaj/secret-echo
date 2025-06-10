export interface Message {
  _id: string;
  id?: string;
  content: string;
  sender?: {
    _id: string;
    username: string;
  };
  isAiResponse: boolean;
  createdAt: string;
  __v?: number;
}

export interface MessagesResponse {
  status: string;
  results: number;
  data: {
    messages: Message[];
  };
}

export interface SendMessageResponse {
  status: string;
  data: {
    userMessage: Message;
    aiMessage: Message;
  };
}

export interface MessagesResponse {
  status: string;
  results: number;
  data: {
    messages: Message[];
  };
}

export interface SendMessageResponse {
  status: string;
  data: {
    userMessage: Message;
    aiMessage: Message;
  };
}