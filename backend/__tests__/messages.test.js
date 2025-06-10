const request = require('supertest');
const { app } = require('../src/index');
const Message = require('../src/models/message');
const { createTestUser, generateTestToken } = require('./helpers');
const { connectDB, disconnectDB, clearDB } = require('../src/config/database');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Message Routes', () => {
  let user;
  let token;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await clearDB();
    user = await createTestUser();
    token = generateTestToken(user);
  });

  describe('GET /api/messages', () => {
    it('should return user messages', async () => {
      await Message.create([
        {
          content: 'Test message 1',
          sender: user._id,
          recipient: user._id,
          isAiResponse: false
        },
        {
          content: 'AI response 1',
          sender: user._id,
          recipient: user._id,
          isAiResponse: true
        }
      ]);

      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.messages)).toBe(true);
      expect(response.body.data.messages.length).toBe(2);
      expect(response.body.data.messages[0]).toHaveProperty('content');
      expect(response.body.data.messages[0]).toHaveProperty('isAiResponse');
    });

    it('should not return messages without authentication', async () => {
      const response = await request(app)
        .get('/api/messages');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/messages', () => {
    it('should create a new message and get AI response', async () => {
      const messageContent = 'Hello AI!';

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: messageContent });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('userMessage');
      expect(response.body.data).toHaveProperty('aiMessage');
      expect(response.body.data.userMessage.content).toBe(messageContent);
      expect(response.body.data.userMessage.isAiResponse).toBe(false);
      expect(response.body.data.aiMessage.isAiResponse).toBe(true);
    });

    it('should not create message without content', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should not create message without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({ content: 'Test message' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/messages/:id', () => {
    it('should return a specific message', async () => {
      const message = await Message.create({
        content: 'Test message',
        sender: user._id,
        recipient: user._id,
        isAiResponse: true
      });

      const response = await request(app)
        .get(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.message.content).toBe('Test message');
    });

    it('should not return message with invalid ID', async () => {
      const response = await request(app)
        .get('/api/messages/invalidid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should not allow access to another user\'s message', async () => {
      const otherUser = await createTestUser({ 
        username: 'otheruser',
        email: 'other@example.com'
      });
      
      const message = await Message.create({
        content: 'Other user message',
        sender: otherUser._id,
        recipient: otherUser._id,
        isAiResponse: false
      });

      const response = await request(app)
        .get(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/messages', () => {
    it('should delete all user messages', async () => {
      await Message.create([
        {
          content: 'Test message 1',
          sender: user._id,
          recipient: user._id,
          isAiResponse: false
        },
        {
          content: 'AI response 1',
          sender: user._id,
          recipient: user._id,
          isAiResponse: true
        }
      ]);

      const response = await request(app)
        .delete('/api/messages')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      
      const messages = await Message.find({ sender: user._id });
      expect(messages.length).toBe(0);
    });

    it('should not delete messages without authentication', async () => {
      const response = await request(app)
        .delete('/api/messages');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
      expect(response.body).toHaveProperty('message');
    });
  });
}); 