const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const dbUri = process.env.NODE_ENV === 'test' 
      ? (process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/secret-echo-test')
      : (process.env.MONGODB_URI || 'mongodb://localhost:27017/secret-echo');

    if (mongoose.connection.readyState === 1) {
      logger.info('MongoDB is already connected');
      return;
    }

    await mongoose.connect(dbUri);
  } catch (error) {
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    throw error;
  }
};

const clearDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Clearing database is only allowed in test environment');
  }
  
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  clearDB
}; 