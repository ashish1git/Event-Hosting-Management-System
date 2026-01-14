const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const axios = require('axios');

// Helper function to calculate event status
const getEventStatus = (event) => {
  const now = new Date();
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'live';
  return 'completed';
};

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

// @desc    Get all public events for users
// @route   GET /api/events
// @access  Public
const getPublicEvents = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const events = await Event.find({ visibility: 'public' }).sort({ startDateTime: 1 });

  // Add status and registration count to each event
  const eventsWithStatus = await Promise.all(events.map(async (event) => {
    const eventStatus = getEventStatus(event);
    const registrationCount = await EventRegistration.countDocuments({
      event: event._id,
      status: { $in: ['approved', 'pending'] }
    });

    return {
      ...event.toObject(),
      status: eventStatus,
      registeredUsers: registrationCount,
      spotsLeft: event.capacity ? event.capacity - registrationCount : null
    };
  }));

  // Filter by status if provided
  const filteredEvents = status
    ? eventsWithStatus.filter(e => e.status === status)
    : eventsWithStatus;

  res.json(filteredEvents);
});

// @desc    Get event details by ID
// @route   GET /api/events/:id
// @access  Public
const getEventDetails = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const eventStatus = getEventStatus(event);
  const registrationCount = await EventRegistration.countDocuments({
    event: event._id,
    status: { $in: ['approved', 'pending'] }
  });

  res.json({
    ...event.toObject(),
    status: eventStatus,
    registeredUsers: registrationCount,
    spotsLeft: event.capacity ? event.capacity - registrationCount : null
  });
});

// @desc    Register user for an event
// @route   POST /api/events/:id/register
// @access  Private (User)
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if event is public
  if (event.visibility !== 'public') {
    res.status(403);
    throw new Error('This event is private');
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

  // Check if user already registered
  const existingRegistration = await EventRegistration.findOne({
    event: event._id,
    user: req.user._id
  });

  if (existingRegistration) {
    res.status(400);
    throw new Error('You are already registered for this event');
  }

  // Create registration
  const registration = await EventRegistration.create({
    event: event._id,
    user: req.user._id,
    status: event.requireApproval ? 'pending' : 'approved',
    paymentStatus: event.ticketType === 'paid' ? 'pending' : 'not_required'
  });

  // Send confirmation email
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Event Registration Confirmation</h2>
        <p>Dear ${req.user.fullName},</p>
        <p>Thank you for registering for <strong>${event.eventName}</strong>!</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Event Details:</h3>
          <p><strong>Event:</strong> ${event.eventName}</p>
          <p><strong>Date:</strong> ${new Date(event.startDateTime).toLocaleString()}</p>
          <p><strong>Location:</strong> ${event.locationType === 'online' ? 'Online' : event.locationValue}</p>
          ${event.locationType === 'online' ? `<p><strong>Link:</strong> ${event.locationValue}</p>` : ''}
          <p><strong>Status:</strong> ${event.requireApproval ? 'Pending Approval' : 'Confirmed'}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          ${event.requireApproval
            ? 'Your registration is pending approval. You will receive another email once approved.'
            : 'Your registration is confirmed! We look forward to seeing you at the event.'}
        </p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          QR Code will be generated and sent to you closer to the event date.
        </p>

        <p>Best regards,<br/>EventSync Team</p>
      </div>
    `;

    await sendEventEmail(
      req.user.email,
      `Registration Confirmation - ${event.eventName}`,
      emailHtml
    );
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
    // Don't fail the registration if email fails
  }

  res.status(201).json({
    message: 'Successfully registered for event',
    registration,
    status: event.requireApproval ? 'pending' : 'approved'
  });
});

// @desc    Get user's registered events
// @route   GET /api/events/my-events
// @access  Private (User)
const getMyEvents = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({ user: req.user._id })
    .populate('event')
    .sort({ registrationDate: -1 });

  const myEvents = registrations.map(reg => ({
    ...reg.event.toObject(),
    registrationStatus: reg.status,
    registrationDate: reg.registrationDate,
    registrationId: reg._id,
    eventStatus: getEventStatus(reg.event)
  }));

  res.json(myEvents);
});

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private (User)
const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findOne({
    event: req.params.id,
    user: req.user._id
  });

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  await registration.deleteOne();
  res.json({ message: 'Registration cancelled successfully' });
});

module.exports = {
  getPublicEvents,
  getEventDetails,
  registerForEvent,
  getMyEvents,
  cancelRegistration
};
