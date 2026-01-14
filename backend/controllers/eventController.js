const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/admin/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const {
    eventName,
    description,
    coverImage,
    calendarType,
    visibility,
    startDateTime,
    endDateTime,
    timeZone,
    locationType,
    locationValue,
    theme,
    ticketType,
    ticketPrice,
    requireApproval,
    capacity
  } = req.body;

  // Basic validation checked by Mongoose, but we can add custom logic here
  if (!eventName || !startDateTime || !endDateTime) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const event = new Event({
    eventName,
    description,
    coverImage,
    calendarType,
    visibility,
    startDateTime,
    endDateTime,
    timeZone,
    locationType,
    locationValue,
    theme,
    ticketType,
    ticketPrice,
    requireApproval,
    capacity,
    createdBy: '65a1234567890abcdef12345' // Temporary bypass for testing
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get all events (Admin view)
// @route   GET /api/admin/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/admin/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    // Check if admin owns the event
    // if (event.createdBy.toString() !== req.admin._id.toString()) {
    //     res.status(401);
    //     throw new Error('Not authorized to update this event');
    // }

    event.eventName = req.body.eventName || event.eventName;
    event.description = req.body.description || event.description;
    event.coverImage = req.body.coverImage || event.coverImage;
    event.calendarType = req.body.calendarType || event.calendarType;
    event.visibility = req.body.visibility || event.visibility;
    event.startDateTime = req.body.startDateTime || event.startDateTime;
    event.endDateTime = req.body.endDateTime || event.endDateTime;
    event.timeZone = req.body.timeZone || event.timeZone;
    event.locationType = req.body.locationType || event.locationType;
    event.locationValue = req.body.locationValue || event.locationValue;
    event.theme = req.body.theme || event.theme;
    event.ticketType = req.body.ticketType || event.ticketType;
    event.ticketPrice = req.body.ticketPrice || event.ticketPrice;
    event.requireApproval = req.body.requireApproval !== undefined ? req.body.requireApproval : event.requireApproval;
    event.capacity = req.body.capacity !== undefined ? req.body.capacity : event.capacity;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    // if (event.createdBy.toString() !== req.admin._id.toString()) {
    //     res.status(401);
    //     throw new Error('Not authorized to delete this event');
    // }
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
