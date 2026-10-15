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
        message: 'Coordinates must be valid [longitude (-180 to 180), latitude (-90 to 90)]'
      }
    }
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      required: [true, 'Tracking code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      minlength: [6, 'Tracking code must be at least 6 characters'],
      maxlength: [30, 'Tracking code cannot exceed 30 characters']
    },
    pickup: {
      address: {
        type: String,
        required: [true, 'Pickup address is required'],
        trim: true
      },
      contactName: { type: String, trim: true },
      contactPhone: { type: String, trim: true },
      location: {
        type: pointSchema,
        required: [true, 'Pickup GeoJSON point is required']
      },
      scheduledTime: { type: Date }
    },
    destination: {
      address: {
        type: String,
        required: [true, 'Destination address is required'],
        trim: true
      },
      recipientName: {
        type: String,
        required: [true, 'Recipient name is required'],
        trim: true
      },
      recipientPhone: {
        type: String,
        required: [true, 'Recipient contact phone is required'],
        trim: true
      },
      location: {
        type: pointSchema,
        required: [true, 'Destination GeoJSON point is required']
      },
      scheduledTime: { type: Date }
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
      index: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'assigned',
          'picked_up',
          'in_transit',
          'out_for_delivery',
          'delivered',
          'failed',
          'cancelled'
        ],
        message: '{VALUE} is not a valid delivery status'
      },
      default: 'pending',
      index: true
    },
    cargo: {
      description: {
        type: String,
        required: [true, 'Cargo description is required'],
        trim: true
      },
      weightKg: {
        type: Number,
        min: [0, 'Cargo weight cannot be negative'],
        default: 0
      },
      volumeM3: {
        type: Number,
        min: [0, 'Cargo volume cannot be negative'],
        default: 0
      },
      isFragile: {
        type: Boolean,
        default: false
      },
      requiresRefrigeration: {
        type: Boolean,
        default: false
      }
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'standard', 'high', 'critical'],
        message: '{VALUE} is not a valid delivery priority'
      },
      default: 'standard',
      index: true
    },
    timestamps: {
      assignedAt: { type: Date, default: null },
      pickedUpAt: { type: Date, default: null },
      deliveredAt: { type: Date, default: null },
      estimatedDeliveryAt: { type: Date, default: null },
      cancelledAt: { type: Date, default: null }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound & Filter Indexes
deliverySchema.index({ status: 1, priority: 1 });
deliverySchema.index({ vehicleId: 1, status: 1 });
deliverySchema.index({ driverId: 1, status: 1 });
deliverySchema.index({ 'pickup.location': '2dsphere' });
deliverySchema.index({ 'destination.location': '2dsphere' });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
