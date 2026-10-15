const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      name: {
        type: String,
        required: [true, 'Actor name is required'],
        trim: true
      },
      role: {
        type: String,
        required: [true, 'Actor role is required'],
        trim: true
      },
      ipAddress: {
        type: String,
        trim: true,
        default: '127.0.0.1'
      }
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      trim: true,
      enum: {
        values: [
          'CREATE',
          'UPDATE',
          'DELETE',
          'LOGIN',
          'LOGOUT',
          'STATUS_CHANGE',
          'DISPATCH',
          'ROUTE_ASSIGNMENT',
          'EMERGENCY_OVERRIDE'
        ],
        message: '{VALUE} is not a valid audit action'
      },
      index: true
    },
    entity: {
      type: {
        type: String,
        required: [true, 'Entity type is required'],
        enum: [
          'User',
          'Vehicle',
          'Driver',
          'Route',
          'Delivery',
          'System',
          'Notification'
        ]
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      identifier: {
        type: String,
        trim: true,
        default: null
      }
    },
    changes: {
      before: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      after: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    },
    timestamp: {
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

// Indexes
auditLogSchema.index({ 'entity.type': 1, 'entity.id': 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ 'actor.userId': 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
