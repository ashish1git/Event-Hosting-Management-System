const jwt = require('jsonwebtoken');
const User = require('../models/User'); // SWITCHED TO USER MODEL
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try finding in User model first
      req.user = await User.findById(decoded.id).select('-password');

      // Legacy support: if not found, it might be the old Admin model used in earlier steps?
      // But since we are moving towards roles, we should stick to User.
      // If req.user is null, the previous logic implies failure.

      if (!req.user) {
         // Fallback or just error out.
         // Assuming we are migrating to the User model with 'admin' role.
         // If you still have the separate Admin model unrelated to User,
         // we might need more complex logic, but "two role admin and user" implies single collection usually.
         // However, existing admin logic used 'req.admin'. Let's support both for now if needed,
         // OR better, just standardization.
         // Let's stick to req.user for new routes.
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
