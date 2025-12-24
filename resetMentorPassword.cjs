const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/alumni-network');
    console.log('✅ MongoDB Connected');

    const mentor = await User.findOne({ email: 'tripskhushi2021@gmail.com' });
    
    if (mentor) {
      console.log('Found user:', mentor.name);
      console.log('Email:', mentor.email);
      
      // Set new password - NOTE: Will be double hashed, so we need to bypass the pre-save hook
      const newPassword = 'Khushi@123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update directly without triggering the pre-save hook
      await User.updateOne(
        { _id: mentor._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log('✅ Password reset successfully!');
      console.log('📧 Email: tripskhushi2021@gmail.com');
      console.log('🔑 Password: Khushi@123');
      console.log('\n✨ Try logging in again!');
    } else {
      console.log('❌ User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetPassword();
