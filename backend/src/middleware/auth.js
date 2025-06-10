const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle both id and userId in token
    const userId = decoded.userId || decoded.id;

    // 3) Check if user still exists
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Authentication failed', 401));
  }
};

module.exports = {
  authenticateToken
}; 