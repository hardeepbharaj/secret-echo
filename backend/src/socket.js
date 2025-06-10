const socketIo = require('socket.io');
const Message = require('./models/message');
const { logger } = require('./utils/logger');
const { generateAiResponse } = require('./services/aiService');
const { verifyToken } = require('./services/auth.service');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error: Token required');
      }

      const user = await verifyToken(token);
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('sendMessage', async (messageData) => {
      try {
        const userMessage = await Message.create({
          content: messageData.content,
          sender: socket.user._id,
          recipient: socket.user._id, // Set recipient as the sender for user messages
          isAiResponse: false
        });

        // Emit the user's message back to confirm receipt
        socket.emit('message', userMessage);

        // Generate and save AI response
        const aiResponse = await generateAiResponse(messageData.content);
        const aiMessage = await Message.create({
          content: aiResponse,
          sender: socket.user._id, // We'll use the same sender for tracking purposes
          recipient: socket.user._id, // Set recipient as the user who sent the original message
          isAiResponse: true
        });

        // Emit AI response
        socket.emit('message', aiMessage);
      } catch (error) {
        logger.error('Error handling message:', error);
        socket.emit('error', { message: 'Error processing message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected:`);
    });
  });

  return io;
}

module.exports = {
  initializeSocket
}; 