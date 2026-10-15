require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const {
  User,
  Driver,
  Vehicle,
  Route,
  Delivery,
  LocationHistory,
  Notification,
  AuditLog
} = require('../models');

const {
  sampleUsers,
  sampleDrivers,
  sampleVehicles,
  sampleRoutes,
  sampleDeliveries,
  sampleLocationHistory,
  sampleNotifications,
  sampleAuditLogs
} = require('./seedData');

// Ensure sample JSON directory exists for offline inspection
const exportSampleJsonFiles = () => {
  const jsonDir = path.join(__dirname, 'sampleJson');
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  const dataset = {
    users: sampleUsers,
    drivers: sampleDrivers,
    vehicles: sampleVehicles,
    routes: sampleRoutes,
    deliveries: sampleDeliveries,
    locationHistory: sampleLocationHistory,
    notifications: sampleNotifications,
    auditLogs: sampleAuditLogs
  };

  Object.entries(dataset).forEach(([collectionName, docs]) => {
    const filePath = path.join(jsonDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
  });

  logger.info(`Sample JSON exports written to: ${jsonDir}`);
};

const runSeed = async () => {
  exportSampleJsonFiles();

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleet_tracking';
  logger.info(`Connecting to MongoDB at: ${mongoURI}...`);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    logger.info('MongoDB connected. Initiating database seeding...');

    // Clean existing collections
    await Promise.all([
      User.deleteMany({}),
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      Route.deleteMany({}),
      Delivery.deleteMany({}),
      LocationHistory.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    logger.info('Cleared existing collections.');

    // Seed collections
    const [
      users,
      drivers,
      vehicles,
      routes,
      deliveries,
      locHistories,
      notifications,
      auditLogs
    ] = await Promise.all([
      User.insertMany(sampleUsers),
      Driver.insertMany(sampleDrivers),
      Vehicle.insertMany(sampleVehicles),
      Route.insertMany(sampleRoutes),
      Delivery.insertMany(sampleDeliveries),
      LocationHistory.insertMany(sampleLocationHistory),
      Notification.insertMany(sampleNotifications),
      AuditLog.insertMany(sampleAuditLogs)
    ]);

    // Ensure 2dsphere and query indexes are synced
    await Promise.all([
      Vehicle.syncIndexes(),
      Route.syncIndexes(),
      Delivery.syncIndexes(),
      LocationHistory.syncIndexes()
    ]);

    console.log('\n======================================================');
    console.log('         DATABASE SEEDING COMPLETED SUCCESSFULLY      ');
    console.log('======================================================');
    console.log(`Users seeded:            ${users.length}`);
    console.log(`Drivers seeded:          ${drivers.length}`);
    console.log(`Vehicles seeded:         ${vehicles.length}`);
    console.log(`Routes seeded:           ${routes.length}`);
    console.log(`Deliveries seeded:       ${deliveries.length}`);
    console.log(`Location points seeded:  ${locHistories.length}`);
    console.log(`Notifications seeded:    ${notifications.length}`);
    console.log(`Audit logs seeded:       ${auditLogs.length}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    logger.warn(
      `MongoDB connection was not active (${err.message}). Seed sample JSON documents have been exported to backend/src/seeds/sampleJson/ for offline testing and review.`
    );
    process.exit(0);
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, exportSampleJsonFiles };
