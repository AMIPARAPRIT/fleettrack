const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number/registration is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      minlength: [3, 'Vehicle number must be at least 3 characters'],
      maxlength: [20, 'Vehicle number cannot exceed 20 characters']
    },
    makeModel: {
      type: String,
      trim: true,
      default: 'Commercial Carrier'
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: {
        values: [
          'semi_truck',
          'box_truck',
          'cargo_van',
          'flatbed',
          'refrigerated_truck',
          'light_truck'
        ],
        message: '{VALUE} is not a valid vehicle type'
      },
      index: true
    },
    capacity: {
      weightKg: {
        type: Number,
        required: [true, 'Cargo weight capacity in kg is required'],
        min: [0, 'Capacity cannot be negative']
      },
      volumeM3: {
        type: Number,
        min: [0, 'Volume cannot be negative'],
        default: 0
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'in_transit', 'idle', 'maintenance', 'decommissioned'],
        message: '{VALUE} is not a valid vehicle status'
      },
      default: 'idle',
      index: true
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true
    },
    lastLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates [longitude, latitude] are required'],
        validate: {
          validator: function (coords) {
            return (
              Array.isArray(coords) &&
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Coordinates must be valid [longitude (-180 to 180), latitude (-90 to 90)]'
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
        min: [0, 'Heading degrees minimum is 0'],
        max: [360, 'Heading degrees maximum is 360']
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    fuelCapacityLiters: {
      type: Number,
      min: [0, 'Fuel capacity cannot be negative'],
      default: 200
    },
    currentFuelPercent: {
      type: Number,
      min: [0, 'Fuel percentage cannot be negative'],
      max: [100, 'Fuel percentage cannot exceed 100'],
      default: 100
    },
    odometerKm: {
      type: Number,
      min: [0, 'Odometer reading cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// GeoJSON 2dsphere index for location queries ($near, $geoWithin)
vehicleSchema.index({ lastLocation: '2dsphere' });

// Compound & Filter Indexes
vehicleSchema.index({ status: 1, type: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
