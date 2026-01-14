const asyncHandler = require('express-async-handler');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EventRegistration = require('../models/EventRegistration');
const QRCodeModel = require('../models/QRCode');
const Event = require('../models/Event');
const User = require('../models/User');
const axios = require('axios');

// Helper function to send email via Brevo
const sendEventEmail = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: process.env.BREVO_SENDER_EMAIL || 'noreply@eventsync.com', name: 'EventSync' },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Email sending failed:', error.response?.data || error.message);
    throw error;
  }
};

// @desc    Generate QR code for approved registration
// @route   POST /api/qr/generate/:registrationId
// @access  Private (User)
const generateQRCode = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findById(req.params.registrationId)
    .populate('event')
    .populate('user');

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  // Check if user owns this registration
  if (registration.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Check if registration is approved
  if (registration.status !== 'approved') {
    res.status(400);
    throw new Error('Registration must be approved to generate QR code');
  }

  // Check if QR code already exists
  let existingQR = await QRCodeModel.findOne({ registration: registration._id });

  if (existingQR && !existingQR.isExpired) {
    return res.json({
      message: 'QR code already exists',
      qrCode: existingQR
    });
  }

  // Generate unique token
  const qrToken = jwt.sign(
    {
      registrationId: registration._id,
      userId: registration.user._id,
      eventId: registration.event._id,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Generate QR code image
  const qrCodeImage = await QRCode.toDataURL(qrToken, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 400,
    margin: 2
  });

  // Calculate expiry (event end time + 1 hour)
  const expiresAt = new Date(registration.event.endDateTime);
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Create or update QR code
  const qrCodeData = {
    event: registration.event._id,
    user: registration.user._id,
    registration: registration._id,
    qrToken,
    qrCodeImage,
    expiresAt,
    isUsed: false,
    isExpired: false
  };

  let qrCode;
  if (existingQR) {
    existingQR = Object.assign(existingQR, qrCodeData);
    qrCode = await existingQR.save();
  } else {
    qrCode = await QRCodeModel.create(qrCodeData);
  }

  // Update registration with QR code reference
  registration.qrCode = qrCodeImage;
  await registration.save();

  // Send email with QR code
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">🎟️ Your Event QR Code is Ready!</h2>
        <p>Dear ${registration.user.fullName},</p>
        <p>Your QR code for <strong>${registration.event.eventName}</strong> has been generated!</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0;">Event QR Code</h3>
          <img src="${qrCodeImage}" alt="QR Code" style="max-width: 300px; border: 2px solid #4f46e5; border-radius: 8px;"/>
          <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
            📱 Save this QR code or show it from your email/dashboard at the event entrance
          </p>
        </div>

        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">📅 Event Details:</h3>
          <p><strong>Event:</strong> ${registration.event.eventName}</p>
          <p><strong>Date:</strong> ${new Date(registration.event.startDateTime).toLocaleString()}</p>
          <p><strong>Location:</strong> ${registration.event.locationType === 'online' ? 'Online' : registration.event.locationValue}</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚠️ Important:</strong><br>
            • This QR code is unique to you and cannot be shared<br>
            • It will be scanned at the event entrance<br>
            • Once scanned, it cannot be used again<br>
            • Keep this email safe or access it from your dashboard
          </p>
        </div>

        <p>See you at the event! 🎉</p>
        <p>Best regards,<br/>EventSync Team</p>
      </div>
    `;

    await sendEventEmail(
      registration.user.email,
      `🎟️ Your QR Code - ${registration.event.eventName}`,
      emailHtml
    );
  } catch (emailError) {
    console.error('Failed to send QR code email:', emailError);
  }

  res.status(201).json({
    message: 'QR code generated successfully',
    qrCode
  });
});

// @desc    Get user's QR code for a registration
// @route   GET /api/qr/registration/:registrationId
// @access  Private (User)
const getQRCode = asyncHandler(async (req, res) => {
  const qrCode = await QRCodeModel.findOne({ registration: req.params.registrationId })
    .populate('event', 'eventName startDateTime endDateTime')
    .populate('user', 'fullName email');

  if (!qrCode) {
    res.status(404);
    throw new Error('QR code not found');
  }

  // Check if user owns this QR code
  if (qrCode.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(qrCode);
});

module.exports = {
  generateQRCode,
  getQRCode
};
