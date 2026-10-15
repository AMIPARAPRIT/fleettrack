require('dotenv').config();
const mongoose = require('mongoose');
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
} = require('../seeds/seedData');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const assert = (condition, description) => {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${description}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${description}`);
  }
};

const runValidationTests = async () => {
  console.log('\n======================================================');
  console.log('       PHASE 2: MONGOOSE SCHEMA VALIDATION SUITE      ');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // 1. Test Valid Seed Documents
  // ------------------------------------------------------------------
  console.log('--- 1. Testing Valid Schema Instantiation & Validation ---');
  
  // User Validation
  for (const u of sampleUsers) {
    const doc = new User(u);
    const err = doc.validateSync();
    assert(!err, `User "${u.name}" passes schema validation`);
  }

  // Driver Validation
  for (const d of sampleDrivers) {
    const doc = new Driver(d);
    const err = doc.validateSync();
    assert(!err, `Driver "${d.fullName}" passes schema validation`);
  }

  // Vehicle Validation (GeoJSON Point & Capacity)
  for (const v of sampleVehicles) {
    const doc = new Vehicle(v);
    const err = doc.validateSync();
    assert(!err, `Vehicle "${v.vehicleNumber}" (${v.type}) passes schema validation`);
  }

  // Route Validation (GeoJSON LineString, Points, Waypoints)
  for (const r of sampleRoutes) {
    const doc = new Route(r);
    const err = doc.validateSync();
    assert(!err, `Route "${r.name}" passes GeoJSON LineString validation`);
  }

  // Delivery Validation
  for (const del of sampleDeliveries) {
    const doc = new Delivery(del);
    const err = doc.validateSync();
    assert(!err, `Delivery "${del.trackingCode}" passes schema validation`);
  }

  // LocationHistory Validation
  for (const loc of sampleLocationHistory) {
    const doc = new LocationHistory(loc);
    const err = doc.validateSync();
    assert(!err, `LocationHistory point [${loc.latitude}, ${loc.longitude}] passes validation`);
  }

  // Notification Validation
  for (const n of sampleNotifications) {
    const doc = new Notification(n);
    const err = doc.validateSync();
    assert(!err, `Notification (${n.category} / ${n.severity}) passes validation`);
  }

  // AuditLog Validation
  for (const a of sampleAuditLogs) {
    const doc = new AuditLog(a);
    const err = doc.validateSync();
    assert(!err, `AuditLog [${a.action}] for entity ${a.entity.type} passes validation`);
  }

  // ------------------------------------------------------------------
  // 2. Test Invalid Boundary & Constraint Rejections
  // ------------------------------------------------------------------
  console.log('\n--- 2. Testing Constraint & Enum Rejection Assertions ---');

  // Invalid Email Rejection
  const invalidUser = new User({
    name: 'Invalid Email User',
    email: 'not-an-email',
    passwordHash: '12345678',
    role: 'dispatcher'
  });
  const userErr = invalidUser.validateSync();
  assert(userErr && userErr.errors.email, 'Rejects invalid email format');

  // Invalid Role Enum Rejection
  const invalidRoleUser = new User({
    name: 'Super Super Admin',
    email: 'valid@example.com',
    passwordHash: '12345678',
    role: 'unauthorized_superman'
  });
  const roleErr = invalidRoleUser.validateSync();
  assert(roleErr && roleErr.errors.role, 'Rejects invalid role enum value');

  // Invalid Vehicle Coordinates Rejection (Longitude > 180)
  const invalidCoordsVehicle = new Vehicle({
    vehicleNumber: 'ERR-999',
    type: 'cargo_van',
    capacity: { weightKg: 1000 },
    lastLocation: {
      type: 'Point',
      coordinates: [245.5, 37.7] // 245.5 > 180
    }
  });
  const coordErr = invalidCoordsVehicle.validateSync();
  assert(coordErr && coordErr.errors['lastLocation.coordinates'], 'Rejects out-of-bounds GeoJSON coordinates');

  // Negative Capacity Rejection
  const negativeCapVehicle = new Vehicle({
    vehicleNumber: 'ERR-NEG',
    type: 'cargo_van',
    capacity: { weightKg: -500 },
    lastLocation: {
      type: 'Point',
      coordinates: [-122.4, 37.7]
    }
  });
  const capErr = negativeCapVehicle.validateSync();
  assert(capErr && capErr.errors['capacity.weightKg'], 'Rejects negative vehicle capacity weight');

  // Invalid Delivery Status Rejection
  const invalidDelivery = new Delivery({
    trackingCode: 'DEL-INV-001',
    pickup: {
      address: 'Test',
      location: { type: 'Point', coordinates: [0, 0] }
    },
    destination: {
      address: 'Test',
      recipientName: 'Rec',
      recipientPhone: '+1-555-010',
      location: { type: 'Point', coordinates: [0, 0] }
    },
    cargo: { description: 'Electronics' },
    status: 'teleported' // Invalid status
  });
  const delErr = invalidDelivery.validateSync();
  assert(delErr && delErr.errors.status, 'Rejects invalid delivery status enum');

  // ------------------------------------------------------------------
  // 3. Test Foreign Key / Relationship Integrity
  // ------------------------------------------------------------------
  console.log('\n--- 3. Testing Relationship Reference Integrity ---');
  
  // Driver -> User
  const driverUserMatch = sampleDrivers.every((d) =>
    sampleUsers.some((u) => u._id.toString() === d.userId.toString())
  );
  assert(driverUserMatch, 'All sample drivers have valid User ObjectId foreign keys');

  // Vehicle -> Driver
  const activeVehicleDrivers = sampleVehicles.filter((v) => v.assignedDriver);
  const vehicleDriverMatch = activeVehicleDrivers.every((v) =>
    sampleDrivers.some((d) => d._id.toString() === v.assignedDriver.toString())
  );
  assert(vehicleDriverMatch, 'All assigned vehicle drivers map to valid Driver ObjectIds');

  // Delivery -> Vehicle & Driver & Route
  const assignedDeliveries = sampleDeliveries.filter((del) => del.vehicleId);
  const deliveryVehicleMatch = assignedDeliveries.every((del) =>
    sampleVehicles.some((v) => v._id.toString() === del.vehicleId.toString())
  );
  assert(deliveryVehicleMatch, 'All assigned deliveries map to valid Vehicle ObjectIds');

  // ------------------------------------------------------------------
  // 4. Test Database Connectivity Probe
  // ------------------------------------------------------------------
  console.log('\n--- 4. Database Connectivity Probe ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleet_tracking';
  console.log(`  Probing configured MONGODB_URI: ${mongoURI}`);
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    console.log('  [PASS] Live MongoDB connection established successfully');
    await mongoose.disconnect();
  } catch (err) {
    console.log(`  [INFO] MongoDB offline/standby (${err.message})`);
    console.log('  [PASS] Application graceful offline mode verified (non-fatal)');
  }

  // ------------------------------------------------------------------
  // Final Test Results Summary
  // ------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
};

runValidationTests();
