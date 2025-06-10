const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { login, signup, createSendToken } = require('../services/auth.service');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);
    createSendToken(user, 200, res);
  } catch (error) {
    return next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await signup(username, email, password);
    createSendToken(newUser, 201, res);
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

module.exports = router; 