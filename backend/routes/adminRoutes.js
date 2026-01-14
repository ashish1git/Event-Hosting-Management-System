const express = require('express');
const router = express.Router();
const {
  authAdmin,
  registerAdmin
} = require('../controllers/authController');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/login', authAdmin);
router.post('/register', registerAdmin);

// Event routes
// All event routes below are protected
router.route('/events')
  .get(getEvents)
  .post(createEvent);

router.route('/events/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

// Event registration management routes
const {
  getEventRegistrations,
  updateRegistrationStatus,
  addUserToEvent,
  removeUserFromEvent,
  getEventStats
} = require('../controllers/adminEventController');

router.get('/events/:id/registrations', getEventRegistrations);
router.get('/events/:id/stats', getEventStats);
router.put('/events/:eventId/registrations/:registrationId', updateRegistrationStatus);
router.post('/events/:id/add-user', addUserToEvent);
router.delete('/events/:eventId/registrations/:registrationId', removeUserFromEvent);

module.exports = router;
