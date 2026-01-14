const express = require('express');
const router = express.Router();
const { generateQRCode, getQRCode } = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');

// User routes - must be authenticated
router.post('/generate/:registrationId', protect, generateQRCode);
router.get('/registration/:registrationId', protect, getQRCode);

module.exports = router;
