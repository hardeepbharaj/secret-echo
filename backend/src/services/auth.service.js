const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { AppError } = require('../middleware/errorHandler');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Incorrect email or password', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError('Incorrect email or password', 401);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const signup = async (username, email, password) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return newUser;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('User with this email or username already exists', 400);
    }
    throw error;
  }
};

class AuthService {
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new AppError('User not found', 401);
      }

      return user;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}

module.exports = {
  login,
  signup,
  signToken,
  createSendToken,
  generateToken: AuthService.prototype.generateToken,
  verifyToken: AuthService.prototype.verifyToken
}; 