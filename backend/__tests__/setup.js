const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { logger } = require('../src/utils/logger');

// Disable logging during tests
logger.silent = true;

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  try {
    // Close any existing connections
    await mongoose.disconnect();
    
    // Create new memory server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Error in test setup:', error);
    throw error;
  }
});

// Clear all data after each test
afterEach(async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing test data:', error);
    throw error;
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongod.stop();
  } catch (error) {
    console.error('Error in test teardown:', error);
    throw error;
  }
}); 