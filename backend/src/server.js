require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { initSocketServer } = require('./sockets/socketManager');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = http.createServer(app);

// Attach Socket.IO
const io = initSocketServer(httpServer);

// Connect to MongoDB & start server
const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    logger.info(`Fleet Tracking API server running on port ${PORT}`, {
      port: PORT,
      env: process.env.NODE_ENV || 'development',
      healthUrl: `http://localhost:${PORT}/api/health`
    });
  });
};

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info('HTTP and WebSocket server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = { httpServer, app, io };
