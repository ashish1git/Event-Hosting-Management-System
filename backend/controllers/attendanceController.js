const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const QRCodeModel = require('../models/QRCode');
const Attendance = require('../models/Attendance');
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const axios = require('axios');

// Helper function to send email
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
  }
};

// @desc    Scan and validate QR code
// @route   POST /api/attendance/scan
// @access  Private (Admin)
const scanQRCode = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken) {
    res.status(400);
    throw new Error('QR token is required');
  }

  // Verify JWT token
  let decoded;
  try {
    decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
  } catch (error) {
    res.status(400);
    throw new Error('Invalid or expired QR code');
  }

  // Find QR code in database
  const qrCode = await QRCodeModel.findOne({ qrToken })
    .populate('event')
    .populate('user')
    .populate('registration');

  if (!qrCode) {
    res.status(404);
    throw new Error('QR code not found');
  }

  // Check if already used
  if (qrCode.isUsed) {
    res.status(400);
    throw new Error('QR code has already been scanned');
  }

  // Check if expired
  if (qrCode.isExpired || new Date() > qrCode.expiresAt) {
    qrCode.isExpired = true;
    await qrCode.save();
    res.status(400);
    throw new Error('QR code has expired');
  }

  // Check if registration is approved
  if (qrCode.registration.status !== 'approved') {
    res.status(400);
    throw new Error('Registration is not approved');
  }

  // Check if already attended
  const existingAttendance = await Attendance.findOne({
    event: qrCode.event._id,
    user: qrCode.user._id
  });

  if (existingAttendance) {
    res.status(400);
    throw new Error('User has already checked in for this event');
  }

  // Mark QR code as used
  qrCode.isUsed = true;
  qrCode.isExpired = true;
  qrCode.scannedAt = new Date();
  qrCode.scannedBy = req.user._id; // Admin who scanned
  await qrCode.save();

  // Create attendance record
  const attendance = await Attendance.create({
    event: qrCode.event._id,
    user: qrCode.user._id,
    registration: qrCode.registration._id,
    qrCode: qrCode._id,
    scannedBy: req.user._id,
    scanTime: new Date()
  });

  // Send confirmation email with feedback prompt
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✅ Welcome to ${qrCode.event.eventName}!</h2>
        <p>Hi ${qrCode.user.fullName},</p>
        <p>🎉 Your attendance has been successfully recorded!</p>

        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #065f46; margin-top: 0;">✨ Check-in Confirmed ✨</h3>
          <p style="font-size: 48px; margin: 10px 0;">🎊</p>
          <p style="color: #047857; margin: 0;">
            <strong>Event:</strong> ${qrCode.event.eventName}<br>
            <strong>Time:</strong> ${new Date().toLocaleString()}
          </p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📝 We'd love your feedback!</strong><br>
            After the event, please share your experience to help us improve future events.
            You can submit feedback from your dashboard.
          </p>
        </div>

        <p>Enjoy the event! 🎉</p>
        <p>Best regards,<br/>EventSync Team</p>
      </div>
    `;

    await sendEventEmail(
      qrCode.user.email,
      `✅ Check-in Confirmed - ${qrCode.event.eventName}`,
      emailHtml
    );
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }

  res.json({
    success: true,
    message: '✅ Attendance recorded successfully!',
    attendance: {
      ...attendance.toObject(),
      userName: qrCode.user.fullName,
      userEmail: qrCode.user.email,
      eventName: qrCode.event.eventName
    },
    playSound: true // Signal to play success sound
  });
});

// @desc    Get attendance list for an event
// @route   GET /api/attendance/event/:eventId
// @access  Private (Admin)
const getEventAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ event: req.params.eventId })
    .populate('user', 'fullName email')
    .populate('scannedBy', 'username')
    .sort({ scanTime: -1 });

  const event = await Event.findById(req.params.eventId);
  const totalRegistrations = await EventRegistration.countDocuments({
    event: req.params.eventId,
    status: 'approved'
  });

  res.json({
    event: event.eventName,
    totalRegistrations,
    totalAttendance: attendance.length,
    attendanceRate: totalRegistrations > 0 ? ((attendance.length / totalRegistrations) * 100).toFixed(2) : 0,
    attendance
  });
});

// @desc    Submit feedback for attended event
// @route   POST /api/feedback
// @access  Private (User)
const submitFeedback = asyncHandler(async (req, res) => {
  const { eventId, rating, comment } = req.body;

  if (!eventId || !rating) {
    res.status(400);
    throw new Error('Event ID and rating are required');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if user attended the event
  const attendance = await Attendance.findOne({
    event: eventId,
    user: req.user._id
  });

  if (!attendance) {
    res.status(400);
    throw new Error('You must attend the event to submit feedback');
  }

  // Check if feedback already submitted
  const existingFeedback = await Feedback.findOne({
    event: eventId,
    user: req.user._id
  });

  if (existingFeedback) {
    res.status(400);
    throw new Error('You have already submitted feedback for this event');
  }

  // Create feedback
  const feedback = await Feedback.create({
    event: eventId,
    user: req.user._id,
    attendance: attendance._id,
    rating,
    comment: comment || ''
  });

  // Update attendance record
  attendance.feedbackSubmitted = true;
  await attendance.save();

  res.status(201).json({
    message: '🎉 Thank you for your feedback!',
    feedback
  });
});

// @desc    Get feedback for an event
// @route   GET /api/feedback/event/:eventId
// @access  Private (Admin)
const getEventFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ event: req.params.eventId })
    .populate('user', 'fullName email')
    .sort({ submittedAt: -1 });

  const totalFeedback = feedback.length;
  const averageRating = totalFeedback > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(2)
    : 0;

  const ratingDistribution = {
    5: feedback.filter(f => f.rating === 5).length,
    4: feedback.filter(f => f.rating === 4).length,
    3: feedback.filter(f => f.rating === 3).length,
    2: feedback.filter(f => f.rating === 2).length,
    1: feedback.filter(f => f.rating === 1).length
  };

  res.json({
    totalFeedback,
    averageRating,
    ratingDistribution,
    feedback
  });
});

// @desc    Get user's feedback history
// @route   GET /api/feedback/my-feedback
// @access  Private (User)
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id })
    .populate('event', 'eventName startDateTime')
    .sort({ submittedAt: -1 });

  res.json(feedback);
});

module.exports = {
  scanQRCode,
  getEventAttendance,
  submitFeedback,
  getEventFeedback,
  getMyFeedback
};
