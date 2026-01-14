const express = require('express');
const router = express.Router();
const { testEmail } = require('../controllers/testController');

// Test email endpoint
router.post('/email', testEmail);

module.exports = router;
