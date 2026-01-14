const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
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
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventRegistration',
    required: true
  },
  qrToken: {
    type: String,
    required: true,
    unique: true
  },
  qrCodeImage: {
    type: String, // Base64 encoded QR code image
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  scannedAt: {
    type: Date,
    default: null
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for quick lookups
qrCodeSchema.index({ qrToken: 1 });
qrCodeSchema.index({ event: 1, user: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);
