const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: [8, 'Password hash must be at least 8 characters']
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'dispatcher', 'driver', 'manager', 'viewer'],
        message: '{VALUE} is not a valid user role'
      },
      default: 'dispatcher',
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'suspended', 'pending'],
        message: '{VALUE} is not a valid account status'
      },
      default: 'active',
      index: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9\s-]{7,20}$/, 'Please provide a valid phone number']
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Compound Indexes
userSchema.index({ role: 1, status: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
