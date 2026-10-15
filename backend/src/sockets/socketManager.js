const { Server } = require('socket.io');
const logger = require('../utils/logger');

let ioInstance = null;

const initSocketServer = (httpServer, options = {}) => {
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin === '*' ? '*' : [clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    ...options
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected`, { socketId: socket.id });

    // Send welcome heartbeat
    socket.emit('connection:ack', {
      connected: true,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      server: 'Fleet Tracking Socket Gateway'
    });

    // Client ping event for latency measurement
    socket.on('client:ping', (data) => {
      socket.emit('server:pong', {
        clientTimestamp: data?.timestamp,
        serverTimestamp: new Date().toISOString()
      });
    });

    // Room subscription placeholder for fleet telemetry
    socket.on('subscribe:vehicle', (vehicleId) => {
      const room = `vehicle:${vehicleId}`;
      socket.join(room);
      logger.info(`Socket ${socket.id} joined room ${room}`);
      socket.emit('subscribed', { room });
    });

    socket.on('unsubscribe:vehicle', (vehicleId) => {
      const room = `vehicle:${vehicleId}`;
      socket.leave(room);
      logger.info(`Socket ${socket.id} left room ${room}`);
      socket.emit('unsubscribed', { room });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket client disconnected`, { socketId: socket.id, reason });
    });
  });

  ioInstance = io;
  return io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized. Call initSocketServer first.');
  }
  return ioInstance;
};

module.exports = {
  initSocketServer,
  getIO
};
