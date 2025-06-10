# Secret Echo - Backend

A robust Node.js backend for the Secret Echo chat application, built with Express, MongoDB, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd secret-echo/backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/secret-echo
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

4. Start MongoDB (if running locally)
```bash
mongod
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

The server will be available at `http://localhost:3001`

## 🏗️ Architecture

### Directory Structure
```
backend/
├── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── tests/                # Test files
└── server.ts             # Entry point
```

### Key Features
- **RESTful API**: Well-structured endpoints following REST principles
- **Authentication**: JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Centralized error handling middleware
- **Validation**: Request validation using express-validator
- **Security**: Implementation of security best practices

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create a new message
- `GET /api/messages/:id` - Get a specific message
- `DELETE /api/messages/:id` - Delete a message

## 🎨 Design Decisions

### Architecture Pattern
- **MVC Pattern**: Clear separation of concerns
- **Service Layer**: Business logic abstraction
- **Repository Pattern**: Data access abstraction

### Database Design
- **MongoDB**: Chosen for its flexibility with chat messages
- **Mongoose**: Used for data modeling and validation
- **Indexes**: Optimized for message queries

### Authentication & Security
- **JWT**: Stateless authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Thorough request validation
- **Error Handling**: Standardized error responses

### Performance Optimizations
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Efficient database queries
- **Caching**: When applicable for frequently accessed data
- **Pagination**: For large data sets

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📦 Build

```bash
npm run build
# or
yarn build
```

## 🚀 Deployment

1. Build the application
```bash
npm run build
```

2. Start the production server
```bash
npm start
```

### Production Considerations
- Set appropriate environment variables
- Configure MongoDB connection string
- Set up proper logging
- Configure rate limiting
- Enable CORS with appropriate origins
- Set up monitoring and error tracking

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server (if using Swagger/OpenAPI).

## 🔒 Security

### Rate Limiting
The application implements rate limiting using `express-rate-limit` to protect against brute force attacks and DoS attempts:

- **Global Rate Limit**:
  - 100 requests per 15 minutes per IP address
  - Applies to all API endpoints
  - Returns 429 (Too Many Requests) when limit is exceeded
  - Custom error message guides users on retry timing

Example response when limit is exceeded:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### Other Security Measures
- CORS configuration
- JWT token validation
- Request validation
- XSS protection
- Helmet security headers
- Environment variable protection 