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

module.exports = router;
