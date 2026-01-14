const express = require('express');
const router = express.Router();
const {
  scanQRCode,
  getEventAttendance,
  submitFeedback,
  getEventFeedback,
  getMyFeedback
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Admin routes - QR scanning and attendance
router.post('/scan', protect, scanQRCode);
router.get('/event/:eventId', protect, getEventAttendance);

// User routes - Feedback
router.post('/feedback', protect, submitFeedback);
router.get('/feedback/my-feedback', protect, getMyFeedback);

// Admin routes - Feedback analytics
router.get('/feedback/event/:eventId', protect, getEventFeedback);

module.exports = router;
