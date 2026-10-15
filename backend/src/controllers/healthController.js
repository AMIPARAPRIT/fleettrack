const os = require('os');
const { getDBStatus } = require('../config/db');

const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  const uptimeSeconds = process.uptime();
  
  const healthData = {
    status: 'ok',
    service: 'Fleet Tracking & Real-Time Logistics API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`
    },
    database: dbStatus,
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memoryUsage: {
        rssMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)
      },
      cpus: os.cpus().length
    }
  };

  res.status(200).json(healthData);
};

module.exports = {
  getHealth
};
