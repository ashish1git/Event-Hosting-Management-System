const mongoose = require('mongoose');
const User = require('./models/User'); // Import the actual User model with hooks
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = '23106034@apsit.edu.in';
    const password = 'chetan.9022';
    const fullName = 'Chetan Admin';

    // Check if user exists in User collection
    let user = await User.findOne({ email });

    if (user) {
      console.log('⚠️  User found, updating to Admin role...');

      // Update fields
      user.role = 'admin';
      user.fullName = fullName;
      user.password = password; // Pre-save hook will hash this

      await user.save();
      console.log('✅ User updated to Admin successfully!');
    } else {
      console.log('ℹ️  Creating new Admin user...');

      // Create new user (password will be hashed by pre-save hook in User model)
      user = await User.create({
        fullName,
        email,
        password,
        role: 'admin'
      });

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n🎉 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
