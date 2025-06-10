const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Message = require('../models/message');
const { AppError } = require('../middleware/errorHandler');
const { generateAiResponse } = require('../services/aiService');

const router = express.Router();

// Protect all routes after this middleware
router.use(authenticateToken);

// Get chat history
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find({
      recipient: req.user._id
    }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages: messages.reverse()
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Send a message
router.post('/', async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return next(new AppError('Message content is required', 400));
    }

    // Create user message
    const userMessage = await Message.create({
      content,
      sender: req.user._id,
      recipient: req.user._id,
      isAiResponse: false
    });

    // Generate AI response
    const aiResponse = await generateAiResponse(content);
    
    // Create AI message with the same recipient
    const aiMessage = await Message.create({
      content: aiResponse,
      sender: req.user._id,
      recipient: req.user._id,
      isAiResponse: true
    });

    res.status(201).json({
      status: 'success',
      data: {
        userMessage,
        aiMessage
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get specific message
router.get('/:id', async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return next(new AppError('No message found with that ID', 404));
    }

    // Check if user is the recipient of the message
    if (message.recipient.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to view this message', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid message ID', 404));
    }
    return next(error);
  }
});

// Delete all messages
router.delete('/', async (req, res, next) => {
  try {
    // Only delete messages where the current user is the recipient
    await Message.deleteMany({
      recipient: req.user._id
    });

    res.status(200).json({
      status: 'success',
      message: 'All messages deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router; 