# SecretEcho 🤖

A real-time AI companion messaging web application built with Next.js, Express, and MongoDB.

## 🎯 Overview

SecretEcho is a scalable messaging platform that simulates an AI companion. It features real-time chat capabilities, user authentication, and persistent message storage.

## 🏗 Architecture

The project follows a modern full-stack architecture:

### Frontend (Next.js + React)
- Server-side rendering for optimal performance
- Real-time updates using Socket.io
- JWT-based authentication
- Responsive design using Tailwind CSS

### Backend (Express + MongoDB)
- RESTful API design
- WebSocket integration for real-time messaging
- JWT authentication middleware
- MongoDB for persistent storage
- Rate limiting and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secret-echo.git
cd secret-echo
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Backend (.env)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/secret-echo
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## 📁 Project Structure

```
secret-echo/
├── frontend/                # Next.js frontend application
│   ├── app/                # App router components
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions and hooks
│   └── styles/            # Global styles and Tailwind config
├── backend/               # Express backend application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helper functions
│   └── tests/           # Backend tests
└── docker/              # Docker configuration files
```

## 🔑 Features

- Real-time messaging
- JWT authentication
- Persistent chat history
- Simulated AI responses
- Responsive design
- Error handling and logging
- Rate limiting

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📝 API Documentation

### Authentication
- POST /api/auth/signup - Create new user account
- POST /api/auth/login - Login user

### Messages
- GET /api/messages - Get chat history
- POST /api/messages - Send new message
- GET /api/messages/:id - Get specific message

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Socket.io-client
- **Backend**: Express, MongoDB, Socket.io
- **Testing**: Jest, React Testing Library
- **DevOps**: Docker, ESLint, Prettier

## 📈 Future Improvements

- Integration with real AI models
- Message search functionality
- User profiles and settings
- Message encryption
- Voice messages
- Image sharing capabilities

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request 