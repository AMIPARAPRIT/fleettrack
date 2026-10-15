const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID reference is required'],
      index: true
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude minimum is -90'],
      max: [90, 'Latitude maximum is 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude minimum is -180'],
      max: [180, 'Longitude maximum is 180']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0]
      }
    },
    speed: {
      type: Number,
      default: 0,
      min: [0, 'Speed cannot be negative']
    },
    heading: {
      type: Number,
      default: 0,
      min: [0, 'Heading minimum is 0 degrees'],
      max: [360, 'Heading maximum is 360 degrees']
    },
    altitude: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      enum: {
        values: [
          'gps_transponder',
          'mobile_app',
          'simulated',
          'manual_entry',
          'obd_ii'
        ],
        message: '{VALUE} is not a valid telemetry source'
      },
      default: 'gps_transponder',
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: [true, 'Telemetry timestamp is required'],
      index: true
    },
    telemetry: {
      odometerKm: { type: Number, default: null },
      fuelLevelPercent: { type: Number, default: null },
      engineStatus: {
        type: String,
        enum: ['on', 'off', 'idle', 'diagnostic_error'],
        default: 'on'
      },
      batteryVoltage: { type: Number, default: null }
    }
  },
  {
    timestamps: false, // We use the explicit telemetry `timestamp`
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Synchronize GeoJSON Point coordinates with latitude and longitude before save
locationHistorySchema.pre('validate', function (next) {
  if (this.longitude !== undefined && this.latitude !== undefined) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  }
  next();
});

// Indexes
locationHistorySchema.index({ location: '2dsphere' });
locationHistorySchema.index({ vehicleId: 1, timestamp: -1 });
locationHistorySchema.index({ timestamp: -1 });

const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);

module.exports = LocationHistory;
