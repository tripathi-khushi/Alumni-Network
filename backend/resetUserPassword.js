const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/alumni-network');
    console.log('✅ MongoDB Connected');

    const user = await User.findOne({ email: 'tripskhushi2021@gmail.com' });
    
    if (user) {
      console.log('Found user:', user.name);
      console.log('Email:', user.email);
      
      // Set new password - update directly to avoid double hashing
      const newPassword = 'Khushi@123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update directly without triggering the pre-save hook
      await User.updateOne(
        { _id: user._id },
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
