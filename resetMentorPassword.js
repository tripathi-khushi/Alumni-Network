const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/alumni-network');
    console.log('✅ MongoDB Connected');

    const mentor = await User.findOne({ email: 'tripathikhushi000@gmail.com' });
    
    if (mentor) {
      console.log('Found mentor:', mentor.name);
      console.log('Email:', mentor.email);
      
      const newPassword = 'password123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      mentor.password = hashedPassword;
      await mentor.save();
      
      console.log('✅ Password reset successfully!');
      console.log('📧 Email: tripathikhushi000@gmail.com');
      console.log('🔑 Password: password123');
      console.log('\n✨ Try logging in again!');
    } else {
      console.log('❌ Mentor not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetPassword();
