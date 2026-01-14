const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Reusing existing middleware if compatible

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Private routes
// Assuming 'protect' middleware looks for Bearer token and sets req.user
// We need to verify if the existing protect middleware supports the 'User' model
// or if it's hardcoded for 'Admin'. I will check that next,
// but for now let's assume I might need a separate 'protectUser' or update the existing one.
// Let's create a generic route but comment out protection until verified.
// router.get('/me', protect, getMe);

module.exports = router;
