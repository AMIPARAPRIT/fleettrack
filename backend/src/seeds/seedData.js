const mongoose = require('mongoose');

// Generate static deterministic ObjectIds for sample data relationships
const ids = {
  users: {
    admin: new mongoose.Types.ObjectId('65e8a1000000000000000001'),
    dispatcher: new mongoose.Types.ObjectId('65e8a1000000000000000002'),
    driver1: new mongoose.Types.ObjectId('65e8a1000000000000000003'),
    driver2: new mongoose.Types.ObjectId('65e8a1000000000000000004'),
    driver3: new mongoose.Types.ObjectId('65e8a1000000000000000005')
  },
  drivers: {
    driver1: new mongoose.Types.ObjectId('65e8a2000000000000000001'),
    driver2: new mongoose.Types.ObjectId('65e8a2000000000000000002'),
    driver3: new mongoose.Types.ObjectId('65e8a2000000000000000003')
  },
  vehicles: {
    truck1: new mongoose.Types.ObjectId('65e8a3000000000000000001'),
    van1: new mongoose.Types.ObjectId('65e8a3000000000000000002'),
    box1: new mongoose.Types.ObjectId('65e8a3000000000000000003'),
    ref1: new mongoose.Types.ObjectId('65e8a3000000000000000004')
  },
  routes: {
    route1: new mongoose.Types.ObjectId('65e8a4000000000000000001'),
    route2: new mongoose.Types.ObjectId('65e8a4000000000000000002'),
    route3: new mongoose.Types.ObjectId('65e8a4000000000000000003')
  },
  deliveries: {
    del1: new mongoose.Types.ObjectId('65e8a5000000000000000001'),
    del2: new mongoose.Types.ObjectId('65e8a5000000000000000002'),
    del3: new mongoose.Types.ObjectId('65e8a5000000000000000003'),
    del4: new mongoose.Types.ObjectId('65e8a5000000000000000004')
  }
};

// 1. Realistic Sample Users
const sampleUsers = [
  {
    _id: ids.users.admin,
    name: 'Marcus Vance',
    email: 'admin.vance@fleetpulse.io',
    passwordHash: '$2b$10$wT8fU/8pQ2xZ0FjX17R5r.u8m6F7W0z4n9H3e7Q2A1B8C9D0E1F2G', // mock bcrypt hash
    role: 'admin',
    status: 'active',
    phoneNumber: '+1-555-010-9921'
  },
  {
    _id: ids.users.dispatcher,
    name: 'Elena Rostova',
    email: 'elena.dispatcher@fleetpulse.io',
    passwordHash: '$2b$10$wT8fU/8pQ2xZ0FjX17R5r.u8m6F7W0z4n9H3e7Q2A1B8C9D0E1F2G',
    role: 'dispatcher',
    status: 'active',
    phoneNumber: '+1-555-010-8834'
  },
  {
    _id: ids.users.driver1,
    name: 'Alexander Morgan',
    email: 'alex.morgan@fleetpulse.io',
    passwordHash: '$2b$10$wT8fU/8pQ2xZ0FjX17R5r.u8m6F7W0z4n9H3e7Q2A1B8C9D0E1F2G',
    role: 'driver',
    status: 'active',
    phoneNumber: '+1-555-019-3312'
  },
  {
    _id: ids.users.driver2,
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@fleetpulse.io',
    passwordHash: '$2b$10$wT8fU/8pQ2xZ0FjX17R5r.u8m6F7W0z4n9H3e7Q2A1B8C9D0E1F2G',
    role: 'driver',
    status: 'active',
    phoneNumber: '+1-555-019-4423'
  },
  {
    _id: ids.users.driver3,
    name: 'David Chen',
    email: 'david.chen@fleetpulse.io',
    passwordHash: '$2b$10$wT8fU/8pQ2xZ0FjX17R5r.u8m6F7W0z4n9H3e7Q2A1B8C9D0E1F2G',
    role: 'driver',
    status: 'active',
    phoneNumber: '+1-555-019-5567'
  }
];

// 2. Realistic Sample Drivers
const sampleDrivers = [
  {
    _id: ids.drivers.driver1,
    userId: ids.users.driver1,
    fullName: 'Alexander Morgan',
    contactNumber: '+1-555-019-3312',
    licenseNumber: 'CDL-CA-99281A',
    licenseExpiry: new Date('2028-06-30T00:00:00.000Z'),
    availability: 'on_trip',
    assignedVehicle: ids.vehicles.truck1,
    experienceYears: 8,
    safetyRating: 4.9,
    emergencyContact: {
      name: 'Claire Morgan',
      phone: '+1-555-019-3313',
      relationship: 'Spouse'
    }
  },
  {
    _id: ids.drivers.driver2,
    userId: ids.users.driver2,
    fullName: 'Sarah Jenkins',
    contactNumber: '+1-555-019-4423',
    licenseNumber: 'CDL-CA-88371B',
    licenseExpiry: new Date('2027-11-15T00:00:00.000Z'),
    availability: 'available',
    assignedVehicle: ids.vehicles.van1,
    experienceYears: 5,
    safetyRating: 4.8,
    emergencyContact: {
      name: 'Robert Jenkins',
      phone: '+1-555-019-4420',
      relationship: 'Father'
    }
  },
  {
    _id: ids.drivers.driver3,
    userId: ids.users.driver3,
    fullName: 'David Chen',
    contactNumber: '+1-555-019-5567',
    licenseNumber: 'CDL-CA-77492C',
    licenseExpiry: new Date('2029-02-28T00:00:00.000Z'),
    availability: 'on_trip',
    assignedVehicle: ids.vehicles.ref1,
    experienceYears: 11,
    safetyRating: 5.0,
    emergencyContact: {
      name: 'Mei Chen',
      phone: '+1-555-019-5568',
      relationship: 'Spouse'
    }
  }
];

// 3. Realistic Sample Vehicles (San Francisco & Silicon Valley coordinates)
const sampleVehicles = [
  {
    _id: ids.vehicles.truck1,
    vehicleNumber: 'FL-TRK-101',
    makeModel: 'Freightliner Cascadia 126',
    type: 'semi_truck',
    capacity: {
      weightKg: 24000,
      volumeM3: 95
    },
    status: 'in_transit',
    assignedDriver: ids.drivers.driver1,
    lastLocation: {
      type: 'Point',
      coordinates: [-122.3957, 37.7812], // Downtown San Francisco
      speed: 68.5,
      heading: 145,
      updatedAt: new Date()
    },
    fuelCapacityLiters: 450,
    currentFuelPercent: 82,
    odometerKm: 148200
  },
  {
    _id: ids.vehicles.van1,
    vehicleNumber: 'FL-VAN-204',
    makeModel: 'Mercedes-Benz Sprinter 3500',
    type: 'cargo_van',
    capacity: {
      weightKg: 2200,
      volumeM3: 15
    },
    status: 'idle',
    assignedDriver: ids.drivers.driver2,
    lastLocation: {
      type: 'Point',
      coordinates: [-122.2711, 37.8044], // Oakland Depot
      speed: 0,
      heading: 0,
      updatedAt: new Date()
    },
    fuelCapacityLiters: 95,
    currentFuelPercent: 95,
    odometerKm: 42100
  },
  {
    _id: ids.vehicles.box1,
    vehicleNumber: 'FL-BOX-305',
    makeModel: 'Isuzu FTR Heavy-Duty Box',
    type: 'box_truck',
    capacity: {
      weightKg: 12500,
      volumeM3: 45
    },
    status: 'maintenance',
    assignedDriver: null,
    lastLocation: {
      type: 'Point',
      coordinates: [-121.8863, 37.3382], // San Jose Service Center
      speed: 0,
      heading: 270,
      updatedAt: new Date()
    },
    fuelCapacityLiters: 260,
    currentFuelPercent: 44,
    odometerKm: 98450
  },
  {
    _id: ids.vehicles.ref1,
    vehicleNumber: 'FL-REF-402',
    makeModel: 'Volvo VNL 760 Reefer Unit',
    type: 'refrigerated_truck',
    capacity: {
      weightKg: 21000,
      volumeM3: 88
    },
    status: 'in_transit',
    assignedDriver: ids.drivers.driver3,
    lastLocation: {
      type: 'Point',
      coordinates: [-122.0842, 37.422], // Mountain View Transit Corridor
      speed: 74.2,
      heading: 130,
      updatedAt: new Date()
    },
    fuelCapacityLiters: 420,
    currentFuelPercent: 68,
    odometerKm: 185600
  }
];

// 4. Realistic Sample Routes with Waypoints and LineString Geometry
const sampleRoutes = [
  {
    _id: ids.routes.route1,
    name: 'San Francisco to San Jose Tech Express',
    code: 'RT-SF-SJ-01',
    origin: {
      name: 'San Francisco Central Logistics Hub',
      address: '450 7th St, San Francisco, CA 94103',
      location: {
        type: 'Point',
        coordinates: [-122.4048, 37.7765]
      }
    },
    destination: {
      name: 'Silicon Valley South Distribution Yard',
      address: '1850 Junction Ave, San Jose, CA 95112',
      location: {
        type: 'Point',
        coordinates: [-121.9056, 37.3712]
      }
    },
    waypoints: [
      {
        sequence: 1,
        name: 'South San Francisco Crossdock',
        location: {
          type: 'Point',
          coordinates: [-122.4216, 37.6547]
        },
        estimatedStopMinutes: 20
      },
      {
        sequence: 2,
        name: 'Palo Alto Express Transfer Point',
        location: {
          type: 'Point',
          coordinates: [-122.143, 37.4419]
        },
        estimatedStopMinutes: 15
      }
    ],
    routeGeometry: {
      type: 'LineString',
      coordinates: [
        [-122.4048, 37.7765],
        [-122.4216, 37.6547],
        [-122.3255, 37.563],
        [-122.2272, 37.4852],
        [-122.143, 37.4419],
        [-122.0842, 37.422],
        [-121.9899, 37.3861],
        [-121.9056, 37.3712]
      ]
    },
    distance: {
      valueKm: 78.5,
      estimatedDurationMinutes: 65
    },
    isActive: true
  },
  {
    _id: ids.routes.route2,
    name: 'Port of Oakland to Sacramento Freight Link',
    code: 'RT-OAK-SAC-02',
    origin: {
      name: 'Port of Oakland Terminal 3',
      address: '530 Water St, Oakland, CA 94607',
      location: {
        type: 'Point',
        coordinates: [-122.2882, 37.7958]
      }
    },
    destination: {
      name: 'Sacramento Regional Fulfillment Depot',
      address: '3800 Pell Dr, Sacramento, CA 95838',
      location: {
        type: 'Point',
        coordinates: [-121.4552, 38.6438]
      }
    },
    waypoints: [
      {
        sequence: 1,
        name: 'Vallejo Highway Weigh Station',
        location: {
          type: 'Point',
          coordinates: [-122.2566, 38.1041]
        },
        estimatedStopMinutes: 10
      }
    ],
    routeGeometry: {
      type: 'LineString',
      coordinates: [
        [-122.2882, 37.7958],
        [-122.2566, 38.1041],
        [-122.0405, 38.2494],
        [-121.7405, 38.5449],
        [-121.4552, 38.6438]
      ]
    },
    distance: {
      valueKm: 135.2,
      estimatedDurationMinutes: 110
    },
    isActive: true
  }
];

// 5. Realistic Sample Deliveries
const sampleDeliveries = [
  {
    _id: ids.deliveries.del1,
    trackingCode: 'DEL-2026-90412',
    pickup: {
      address: 'BioPharma Cold Storage, South San Francisco, CA',
      contactName: 'Dr. Evelyn Reed',
      contactPhone: '+1-555-012-3344',
      location: {
        type: 'Point',
        coordinates: [-122.4216, 37.6547]
      },
      scheduledTime: new Date(Date.now() - 3600000 * 2)
    },
    destination: {
      address: 'Stanford Health Care Pavilion, Palo Alto, CA',
      recipientName: 'Pharmacy Logistics Desk',
      recipientPhone: '+1-555-012-7788',
      location: {
        type: 'Point',
        coordinates: [-122.1704, 37.4348]
      },
      scheduledTime: new Date(Date.now() + 3600000 * 2)
    },
    vehicleId: ids.vehicles.ref1,
    driverId: ids.drivers.driver3,
    routeId: ids.routes.route1,
    status: 'in_transit',
    cargo: {
      description: 'Temperature-Sensitive Vaccines & Biologics (-20C)',
      weightKg: 850,
      volumeM3: 4.5,
      isFragile: true,
      requiresRefrigeration: true
    },
    priority: 'critical',
    timestamps: {
      assignedAt: new Date(Date.now() - 3600000 * 4),
      pickedUpAt: new Date(Date.now() - 3600000 * 2),
      estimatedDeliveryAt: new Date(Date.now() + 3600000 * 1.5)
    },
    notes: 'Maintain internal container temperature below -20 deg Celsius at all times.'
  },
  {
    _id: ids.deliveries.del2,
    trackingCode: 'DEL-2026-90413',
    pickup: {
      address: 'Port of Oakland Terminal 3, Oakland, CA',
      contactName: 'Marcus Bradley',
      contactPhone: '+1-555-018-9901',
      location: {
        type: 'Point',
        coordinates: [-122.2882, 37.7958]
      },
      scheduledTime: new Date(Date.now() - 3600000 * 3)
    },
    destination: {
      address: 'Silicon Valley Data Logistics Hub, San Jose, CA',
      recipientName: 'Server Operations Dock',
      recipientPhone: '+1-555-018-4455',
      location: {
        type: 'Point',
        coordinates: [-121.9056, 37.3712]
      },
      scheduledTime: new Date(Date.now() + 3600000 * 3)
    },
    vehicleId: ids.vehicles.truck1,
    driverId: ids.drivers.driver1,
    routeId: ids.routes.route1,
    status: 'in_transit',
    cargo: {
      description: 'High-Density Server Racks and Optical Switchgear',
      weightKg: 14200,
      volumeM3: 65,
      isFragile: true,
      requiresRefrigeration: false
    },
    priority: 'high',
    timestamps: {
      assignedAt: new Date(Date.now() - 3600000 * 5),
      pickedUpAt: new Date(Date.now() - 3600000 * 1.5),
      estimatedDeliveryAt: new Date(Date.now() + 3600000 * 2.5)
    },
    notes: 'Air-ride suspension equipped trailer required.'
  },
  {
    _id: ids.deliveries.del3,
    trackingCode: 'DEL-2026-90414',
    pickup: {
      address: 'East Bay Industrial Park, Fremont, CA',
      contactName: 'Gordon Myers',
      contactPhone: '+1-555-014-2233',
      location: {
        type: 'Point',
        coordinates: [-121.9886, 37.5485]
      },
      scheduledTime: new Date(Date.now() - 3600000 * 8)
    },
    destination: {
      address: 'Oakland Metro Parts Depot, Oakland, CA',
      recipientName: 'Warehouse Manager Jim',
      recipientPhone: '+1-555-014-6677',
      location: {
        type: 'Point',
        coordinates: [-122.2711, 37.8044]
      },
      scheduledTime: new Date(Date.now() - 3600000 * 2)
    },
    vehicleId: ids.vehicles.van1,
    driverId: ids.drivers.driver2,
    routeId: null,
    status: 'delivered',
    cargo: {
      description: 'Precision Hydraulic Hose Assemblies',
      weightKg: 420,
      volumeM3: 3.2,
      isFragile: false,
      requiresRefrigeration: false
    },
    priority: 'standard',
    timestamps: {
      assignedAt: new Date(Date.now() - 3600000 * 9),
      pickedUpAt: new Date(Date.now() - 3600000 * 7),
      deliveredAt: new Date(Date.now() - 3600000 * 2),
      estimatedDeliveryAt: new Date(Date.now() - 3600000 * 2)
    },
    notes: 'Delivered and signed by receiving clerk.'
  },
  {
    _id: ids.deliveries.del4,
    trackingCode: 'DEL-2026-90415',
    pickup: {
      address: 'San Jose Electronics Wharf, San Jose, CA',
      contactName: 'Tina Vance',
      contactPhone: '+1-555-016-7788',
      location: {
        type: 'Point',
        coordinates: [-121.8863, 37.3382]
      },
      scheduledTime: new Date(Date.now() + 3600000 * 5)
    },
    destination: {
      address: 'San Francisco Retail Hub, San Francisco, CA',
      recipientName: 'Storefront Receiving',
      recipientPhone: '+1-555-016-1122',
      location: {
        type: 'Point',
        coordinates: [-122.4048, 37.7765]
      },
      scheduledTime: new Date(Date.now() + 3600000 * 9)
    },
    vehicleId: null,
    driverId: null,
    routeId: null,
    status: 'pending',
    cargo: {
      description: 'Commercial Display Monitors (65-inch 4K panels)',
      weightKg: 1850,
      volumeM3: 12.0,
      isFragile: true,
      requiresRefrigeration: false
    },
    priority: 'standard',
    timestamps: {
      estimatedDeliveryAt: new Date(Date.now() + 3600000 * 9)
    },
    notes: 'Awaiting truck assignment upon return of FL-BOX-305 from scheduled service.'
  }
];

// 6. Realistic Sample LocationHistory Breadcrumbs (Simulating continuous telemetry trail)
const sampleLocationHistory = [
  // FL-TRK-101 breadcrumb trail along US-101 Southbound
  {
    vehicleId: ids.vehicles.truck1,
    latitude: 37.7812,
    longitude: -122.3957,
    speed: 68.5,
    heading: 145,
    altitude: 18,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 2),
    telemetry: { odometerKm: 148200, fuelLevelPercent: 82, engineStatus: 'on', batteryVoltage: 13.8 }
  },
  {
    vehicleId: ids.vehicles.truck1,
    latitude: 37.7695,
    longitude: -122.4012,
    speed: 65.0,
    heading: 150,
    altitude: 19,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 4),
    telemetry: { odometerKm: 148197, fuelLevelPercent: 82, engineStatus: 'on', batteryVoltage: 13.9 }
  },
  {
    vehicleId: ids.vehicles.truck1,
    latitude: 37.7511,
    longitude: -122.4055,
    speed: 70.2,
    heading: 160,
    altitude: 22,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 6),
    telemetry: { odometerKm: 148194, fuelLevelPercent: 83, engineStatus: 'on', batteryVoltage: 13.8 }
  },
  {
    vehicleId: ids.vehicles.truck1,
    latitude: 37.7302,
    longitude: -122.4038,
    speed: 72.1,
    heading: 165,
    altitude: 25,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 8),
    telemetry: { odometerKm: 148191, fuelLevelPercent: 83, engineStatus: 'on', batteryVoltage: 13.8 }
  },
  {
    vehicleId: ids.vehicles.truck1,
    latitude: 37.7118,
    longitude: -122.4011,
    speed: 71.0,
    heading: 162,
    altitude: 20,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 10),
    telemetry: { odometerKm: 148188, fuelLevelPercent: 83, engineStatus: 'on', batteryVoltage: 13.7 }
  },

  // FL-REF-402 Reefer Unit breadcrumb trail near Mountain View
  {
    vehicleId: ids.vehicles.ref1,
    latitude: 37.422,
    longitude: -122.0842,
    speed: 74.2,
    heading: 130,
    altitude: 35,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 1),
    telemetry: { odometerKm: 185600, fuelLevelPercent: 68, engineStatus: 'on', batteryVoltage: 14.1 }
  },
  {
    vehicleId: ids.vehicles.ref1,
    latitude: 37.4335,
    longitude: -122.1021,
    speed: 76.0,
    heading: 135,
    altitude: 32,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 3),
    telemetry: { odometerKm: 185597, fuelLevelPercent: 68, engineStatus: 'on', batteryVoltage: 14.0 }
  },
  {
    vehicleId: ids.vehicles.ref1,
    latitude: 37.4452,
    longitude: -122.1215,
    speed: 73.8,
    heading: 132,
    altitude: 30,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 5),
    telemetry: { odometerKm: 185593, fuelLevelPercent: 69, engineStatus: 'on', batteryVoltage: 14.1 }
  },
  {
    vehicleId: ids.vehicles.ref1,
    latitude: 37.4612,
    longitude: -122.1488,
    speed: 69.5,
    heading: 128,
    altitude: 28,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 7),
    telemetry: { odometerKm: 185590, fuelLevelPercent: 69, engineStatus: 'on', batteryVoltage: 14.0 }
  },

  // FL-VAN-204 stationary idle telemetry
  {
    vehicleId: ids.vehicles.van1,
    latitude: 37.8044,
    longitude: -122.2711,
    speed: 0,
    heading: 0,
    altitude: 12,
    source: 'gps_transponder',
    timestamp: new Date(Date.now() - 60000 * 5),
    telemetry: { odometerKm: 42100, fuelLevelPercent: 95, engineStatus: 'off', batteryVoltage: 12.6 }
  }
];

// 7. Realistic Sample Notifications
const sampleNotifications = [
  {
    recipient: ids.users.dispatcher,
    category: 'overspeeding',
    severity: 'warning',
    message: 'Vehicle FL-REF-402 exceeded speed threshold (76.0 km/h in 65 km/h zone) on CA-85 South.',
    readStatus: false,
    metadata: {
      vehicleId: ids.vehicles.ref1,
      driverId: ids.drivers.driver3,
      actionUrl: '/vehicles?id=FL-REF-402'
    },
    createdAt: new Date(Date.now() - 60000 * 3)
  },
  {
    recipient: ids.users.dispatcher,
    category: 'delivery_delayed',
    severity: 'low',
    message: 'Delivery DEL-2026-90412 estimated arrival updated by +12 mins due to traffic congestion.',
    readStatus: true,
    metadata: {
      deliveryId: ids.deliveries.del1,
      vehicleId: ids.vehicles.ref1,
      actionUrl: '/deliveries?code=DEL-2026-90412'
    },
    createdAt: new Date(Date.now() - 60000 * 25)
  },
  {
    recipient: ids.users.dispatcher,
    category: 'delivery_completed',
    severity: 'info',
    message: 'Consignment DEL-2026-90413 has been successfully delivered and verified by recipient.',
    readStatus: true,
    metadata: {
      deliveryId: ids.deliveries.del3,
      vehicleId: ids.vehicles.van1,
      actionUrl: '/deliveries?code=DEL-2026-90414'
    },
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    recipient: ids.users.admin,
    category: 'maintenance_due',
    severity: 'critical',
    message: 'Vehicle FL-BOX-305 requires immediate brake rotor replacement and hydraulic fluid flush.',
    readStatus: false,
    metadata: {
      vehicleId: ids.vehicles.box1,
      actionUrl: '/vehicles?id=FL-BOX-305'
    },
    createdAt: new Date(Date.now() - 3600000 * 6)
  }
];

// 8. Realistic Sample AuditLogs
const sampleAuditLogs = [
  {
    actor: {
      userId: ids.users.dispatcher,
      name: 'Elena Rostova',
      role: 'dispatcher',
      ipAddress: '192.168.1.45'
    },
    action: 'DISPATCH',
    entity: {
      type: 'Delivery',
      id: ids.deliveries.del1,
      identifier: 'DEL-2026-90412'
    },
    changes: {
      before: { status: 'pending', vehicleId: null, driverId: null },
      after: { status: 'in_transit', vehicleId: 'FL-REF-402', driverId: 'David Chen' }
    },
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    actor: {
      userId: ids.users.dispatcher,
      name: 'Elena Rostova',
      role: 'dispatcher',
      ipAddress: '192.168.1.45'
    },
    action: 'ROUTE_ASSIGNMENT',
    entity: {
      type: 'Route',
      id: ids.routes.route1,
      identifier: 'RT-SF-SJ-01'
    },
    changes: {
      before: null,
      after: { assignedVehicle: 'FL-TRK-101', route: 'San Francisco to San Jose Tech Express' }
    },
    timestamp: new Date(Date.now() - 3600000 * 4)
  },
  {
    actor: {
      userId: ids.users.admin,
      name: 'Marcus Vance',
      role: 'admin',
      ipAddress: '192.168.1.10'
    },
    action: 'STATUS_CHANGE',
    entity: {
      type: 'Vehicle',
      id: ids.vehicles.box1,
      identifier: 'FL-BOX-305'
    },
    changes: {
      before: { status: 'idle' },
      after: { status: 'maintenance', reason: 'Scheduled Brake Inspection' }
    },
    timestamp: new Date(Date.now() - 3600000 * 7)
  },
  {
    actor: {
      userId: ids.users.admin,
      name: 'Marcus Vance',
      role: 'admin',
      ipAddress: '192.168.1.10'
    },
    action: 'LOGIN',
    entity: {
      type: 'User',
      id: ids.users.admin,
      identifier: 'admin.vance@fleetpulse.io'
    },
    changes: null,
    timestamp: new Date(Date.now() - 3600000 * 8)
  }
];

module.exports = {
  ids,
  sampleUsers,
  sampleDrivers,
  sampleVehicles,
  sampleRoutes,
  sampleDeliveries,
  sampleLocationHistory,
  sampleNotifications,
  sampleAuditLogs
};
