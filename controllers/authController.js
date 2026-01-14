const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
// Token generation is handled inline below

// Auth token generator inline for simplicity if strictly complying to "baked file" minimal output,
// but sticking to MVC, let's keep it here or import. I'll inline for this snippet to reduce file count if needed,
// but best practice is separate. I will assume utils folder exists or just put it here.
const jwt = require('jsonwebtoken');

const generateTokenFunc = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateTokenFunc(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new admin (Optional, for setup)
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await Admin.create({
    username,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateTokenFunc(admin._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

module.exports = { authAdmin, registerAdmin };
