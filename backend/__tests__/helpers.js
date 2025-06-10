const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!'
  };

  // Merge default user with provided userData
  const userToCreate = { ...defaultUser, ...userData };
  
  // Hash the password before creating the user
  const hashedPassword = await bcrypt.hash(userToCreate.password, 12);
  userToCreate.password = hashedPassword;

  const user = await User.create(userToCreate);
  return user;
};

const generateTestToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

module.exports = {
  createTestUser,
  generateTestToken
}; 