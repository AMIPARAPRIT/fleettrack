const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleet_tracking';

  try {
    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('MongoDB connected successfully', { host: mongoose.connection.host });
    });

    mongoose.connection.on('error', (err) => {
      isConnected = false;
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    logger.info('Attempting MongoDB connection...', { uri: mongoURI });
    
    // Connect with a 5-second serverSelectionTimeoutMS so app start doesn't hang if Mongo isn't active
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
  } catch (error) {
    isConnected = false;
    logger.warn('MongoDB initial connection failed. The application will continue running in offline/graceful mode.', {
      error: error.message
    });
  }
};

const getDBStatus = () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const readyState = mongoose.connection.readyState;
  return {
    state: stateMap[readyState] || 'unknown',
    readyState,
    isConnected: readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

module.exports = {
  connectDB,
  getDBStatus
};
