const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification recipient user ID is required'],
      index: true
    },
    category: {
      type: String,
      required: [true, 'Notification category is required'],
      enum: {
        values: [
          'geofence_breach',
          'overspeeding',
          'harsh_braking',
          'route_deviation',
          'delivery_delayed',
          'delivery_completed',
          'maintenance_due',
          'system'
        ],
        message: '{VALUE} is not a valid notification category'
      },
      index: true
    },
    severity: {
      type: String,
      enum: {
        values: ['info', 'low', 'warning', 'critical'],
        message: '{VALUE} is not a valid severity level'
      },
      default: 'info',
      index: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    readStatus: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null
      },
      deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        default: null
      },
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
      },
      actionUrl: {
        type: String,
        trim: true,
        default: null
      }
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound Indexes for fast inbox filtering
notificationSchema.index({ recipient: 1, readStatus: 1, createdAt: -1 });
notificationSchema.index({ category: 1, severity: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
