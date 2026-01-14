const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const QRCodeModel = require('../models/QRCode');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
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

// Helper to generate QR
const generateQRForRegistration = async (registration) => {
    // Check if exists
    let qrDoc = await QRCodeModel.findOne({
        event: registration.event._id,
        user: registration.user._id,
        registration: registration._id
     });

     if (!qrDoc) {
        // Create Token
        const qrToken = jwt.sign(
           {
             id: registration.user._id,
             eventId: registration.event._id,
             registrationId: registration._id,
             type: 'event_entry'
           },
           process.env.JWT_SECRET,
           { expiresIn: '30d' }
        );

        // Create DB Entry
        qrDoc = await QRCodeModel.create({
            event: registration.event._id,
            user: registration.user._id,
            registration: registration._id,
            token: qrToken,
            status: 'active',
            validFrom: new Date(),
            expiresAt: new Date(new Date().setDate(new Date().getDate() + 30))
        });
     }

     // Generate Data URL
     return await QRCode.toDataURL(qrDoc.token);
};

// @desc    Get all registrations for an event
// @route   GET /api/admin/events/:id/registrations
// @access  Private (Admin)
const getEventRegistrations = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const registrations = await EventRegistration.find({ event: req.params.id })
    .populate('user', 'fullName email')
    .sort({ registrationDate: -1 });

  res.json(registrations);
});

// @desc    Approve or reject registration
// @route   PUT /api/admin/events/:eventId/registrations/:registrationId
// @access  Private (Admin)
const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be approved or rejected');
  }

  const registration = await EventRegistration.findById(req.params.registrationId)
    .populate('user')
    .populate('event');

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  registration.status = status;
  await registration.save();

  // Send email notification
  try {
    let qrImage = null;
    if (status === 'approved') {
        qrImage = await generateQRForRegistration(registration);
    }

    const emailHtml = status === 'approved'
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Registration Approved!</h2>
          <p>Dear ${registration.user.fullName},</p>
          <p>Great news! Your registration for <strong>${registration.event.eventName}</strong> has been approved.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Event:</strong> ${registration.event.eventName}</p>
            <p><strong>Date:</strong> ${new Date(registration.event.startDateTime).toLocaleString()}</p>
            <p><strong>Location:</strong> ${registration.event.locationType === 'online' ? 'Online' : registration.event.locationValue}</p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <p><strong>Your Entry QR Code:</strong></p>
            <img src="${qrImage}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
            <p style="font-size: 12px; color: #666;">Please show this QR code at the entrance.</p>
          </div>

          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br/>EventSync Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Registration Update</h2>
          <p>Dear ${registration.user.fullName},</p>
          <p>We regret to inform you that your registration for <strong>${registration.event.eventName}</strong> could not be approved at this time.</p>
          <p>If you have any questions, please contact us.</p>
          <p>Best regards,<br/>EventSync Team</p>
        </div>
      `;

    await sendEventEmail(
      registration.user.email,
      `Registration ${status === 'approved' ? 'Approved & User QR Code' : 'Update'} - ${registration.event.eventName}`,
      emailHtml
    );
  } catch (emailError) {
    console.error('Failed to send status email:', emailError);
  }

  res.json({
    message: `Registration ${status}`,
    registration
  });
});

// @desc    Manually add user to event
// @route   POST /api/admin/events/:id/add-user
// @access  Private (Admin)
const addUserToEvent = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  let event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if already registered
  const existing = await EventRegistration.findOne({
    event: event._id,
    user: userId
  });

  if (existing) {
    res.status(400);
    throw new Error('User is already registered for this event');
  }

  // Check capacity
  const registrationCount = await EventRegistration.countDocuments({
    event: event._id,
    status: { $in: ['approved', 'pending'] }
  });

  if (event.capacity && registrationCount >= event.capacity) {
    res.status(400);
    throw new Error('Event is full');
  }

  const registration = await EventRegistration.create({
    event: event._id,
    user: userId,
    status: 'approved', // Admin-added users are auto-approved
    paymentStatus: 'not_required'
  });

  // Re-fetch to populate
  const populatedRegistration = await EventRegistration.findById(registration._id)
      .populate('user')
      .populate('event');

  // Send email with QR
  try {
    const qrImage = await generateQRForRegistration(populatedRegistration);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">You've Been Added to an Event!</h2>
        <p>Dear ${user.fullName},</p>
        <p>You have been registered for <strong>${event.eventName}</strong> by an administrator.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Event Details:</h3>
          <p><strong>Event:</strong> ${event.eventName}</p>
          <p><strong>Date:</strong> ${new Date(event.startDateTime).toLocaleString()}</p>
          <p><strong>Location:</strong> ${event.locationType === 'online' ? 'Online' : event.locationValue}</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <p><strong>Your Entry QR Code:</strong></p>
            <img src="${qrImage}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
        </div>

        <p>We look forward to seeing you!</p>
        <p>Best regards,<br/>EventSync Team</p>
      </div>
    `;

    await sendEventEmail(
      user.email,
      `Added to Event - ${event.eventName}`,
      emailHtml
    );
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
  }

  res.status(201).json({
    message: 'User added to event successfully',
    registration
  });
});

// @desc    Remove user from event
// @route   DELETE /api/admin/events/:eventId/registrations/:registrationId
// @access  Private (Admin)
const removeUserFromEvent = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findById(req.params.registrationId);

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  // Also remove QR code if exists
  await QRCodeModel.deleteMany({ registration: registration._id });

  await registration.deleteOne();
  res.json({ message: 'User removed from event' });
});

// @desc    Get event statistics
// @route   GET /api/admin/events/:id/stats
// @access  Private (Admin)
const getEventStats = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const totalRegistrations = await EventRegistration.countDocuments({ event: req.params.id });
  const approvedRegistrations = await EventRegistration.countDocuments({
    event: req.params.id,
    status: 'approved'
  });
  const pendingRegistrations = await EventRegistration.countDocuments({
    event: req.params.id,
    status: 'pending'
  });
  const rejectedRegistrations = await EventRegistration.countDocuments({
    event: req.params.id,
    status: 'rejected'
  });

  res.json({
    eventId: event._id,
    eventName: event.eventName,
    capacity: event.capacity,
    totalRegistrations,
    approvedRegistrations,
    pendingRegistrations,
    rejectedRegistrations,
    spotsLeft: event.capacity ? event.capacity - approvedRegistrations : null
  });
});

module.exports = {
  getEventRegistrations,
  updateRegistrationStatus,
  addUserToEvent,
  removeUserFromEvent,
  getEventStats
};
