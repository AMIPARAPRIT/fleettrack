const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema(
  {
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
        message: 'Coordinates must be [longitude (-180 to 180), latitude (-90 to 90)]'
      }
    }
  },
  { _id: false }
);

const waypointSchema = new mongoose.Schema(
  {
    sequence: {
      type: Number,
      required: [true, 'Waypoint sequence order is required'],
      min: [1, 'Sequence starts at 1']
    },
    name: {
      type: String,
      required: [true, 'Waypoint name is required'],
      trim: true
    },
    location: {
      type: pointSchema,
      required: [true, 'Waypoint coordinates are required']
    },
    estimatedStopMinutes: {
      type: Number,
      default: 15,
      min: 0
    }
  },
  { _id: false }
);

const routeGeometrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: {
      type: [[Number]], // Array of [lng, lat] points
      required: [true, 'LineString coordinates are required'],
      validate: {
        validator: function (coords) {
          return (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            coords.every(
              (pt) =>
                Array.isArray(pt) &&
                pt.length === 2 &&
                pt[0] >= -180 &&
                pt[0] <= 180 &&
                pt[1] >= -90 &&
                pt[1] <= 90
            )
          );
        },
        message: 'LineString requires at least 2 valid [lng, lat] coordinate pairs'
      }
    }
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
      minlength: [3, 'Route name must be at least 3 characters'],
      maxlength: [150, 'Route name cannot exceed 150 characters']
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true
    },
    origin: {
      name: {
        type: String,
        required: [true, 'Origin name is required'],
        trim: true
      },
      address: { type: String, trim: true },
      location: {
        type: pointSchema,
        required: [true, 'Origin GeoJSON point is required']
      }
    },
    destination: {
      name: {
        type: String,
        required: [true, 'Destination name is required'],
        trim: true
      },
      address: { type: String, trim: true },
      location: {
        type: pointSchema,
        required: [true, 'Destination GeoJSON point is required']
      }
    },
    waypoints: {
      type: [waypointSchema],
      default: []
    },
    routeGeometry: {
      type: routeGeometrySchema,
      required: [true, 'Route GeoJSON LineString geometry is required']
    },
    distance: {
      valueKm: {
        type: Number,
        required: [true, 'Route distance in kilometers is required'],
        min: [0, 'Distance cannot be negative']
      },
      estimatedDurationMinutes: {
        type: Number,
        required: [true, 'Estimated transit duration in minutes is required'],
        min: [0, 'Duration cannot be negative']
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// GeoJSON 2dsphere indexes
routeSchema.index({ routeGeometry: '2dsphere' });
routeSchema.index({ 'origin.location': '2dsphere' });
routeSchema.index({ 'destination.location': '2dsphere' });

// Query indexes
routeSchema.index({ name: 1 });

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
