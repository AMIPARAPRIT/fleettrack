const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/health', healthRoutes);

// Base API info
router.get('/', (req, res) => {
  res.json({
    name: 'Fleet Tracking & Logistics API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health'
    }
  });
});

module.exports = router;
