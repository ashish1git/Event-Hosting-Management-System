const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin Model
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: '23106034@apsit.edu.in' });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with this email');

      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('chetan.9022', salt);

      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log('✅ Admin password updated successfully!');
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('chetan.9022', salt);

      // Create admin
      const admin = await Admin.create({
        username: 'chetan_admin',
        email: '23106034@apsit.edu.in',
        password: hashedPassword
      });

      console.log('✅ Admin created successfully!');
      console.log('📧 Email:', admin.email);
      console.log('👤 Username:', admin.username);
    }

    console.log('\n🎉 You can now login with:');
    console.log('   Email: 23106034@apsit.edu.in');
    console.log('   Password: chetan.9022');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
