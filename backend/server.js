const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

connectDB();

const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api/admin', adminRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/test', require('./routes/testRoutes')); // Test endpoints

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
