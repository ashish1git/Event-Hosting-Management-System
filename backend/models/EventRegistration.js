const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      // If event requires approval, default to pending, else approved
      return 'pending';
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'not_required'],
    default: 'not_required'
  },
  paymentId: {
    type: String,
    default: null
  },
  qrCode: {
    type: String,
    default: null // Placeholder for future QR code
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
