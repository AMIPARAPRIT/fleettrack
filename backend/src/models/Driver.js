const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated User ID is required'],
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: [true, 'Driver full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [/^\+?[0-9\s-]{7,20}$/, 'Please provide a valid contact number']
    },
    licenseNumber: {
      type: String,
      required: [true, 'Driver license number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      minlength: [5, 'License number must be at least 5 characters'],
      maxlength: [30, 'License number cannot exceed 30 characters']
    },
    licenseExpiry: {
      type: Date,
      required: [true, 'License expiry date is required']
    },
    availability: {
      type: String,
      enum: {
        values: ['available', 'on_trip', 'off_duty', 'suspended'],
        message: '{VALUE} is not a valid driver availability status'
      },
      default: 'available',
      index: true
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
      index: true
    },
    experienceYears: {
      type: Number,
      min: [0, 'Experience years cannot be negative'],
      default: 1
    },
    safetyRating: {
      type: Number,
      min: [1, 'Safety rating minimum is 1'],
      max: [5, 'Safety rating maximum is 5'],
      default: 5.0
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound Indexes
driverSchema.index({ availability: 1, assignedVehicle: 1 });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
