const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/alumni-network');
    console.log('✅ MongoDB Connected');

    // Check if user already exists
    let user = await User.findOne({ email: 'tripskhushi000@gmail.com' });
    
    if (user) {
      console.log('User already exists:', user.name);
      console.log('Resetting password...');
      
      const newPassword = 'Khushi@123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log('✅ Password reset successfully!');
    } else {
      console.log('Creating new user...');
      
      const password = 'Khushi@123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = new User({
        name: 'Khushi Tripathi',
        email: 'tripskhushi000@gmail.com',
        password: hashedPassword,
        batch: 'Class of 2024',
        role: 'mentor',
        isMentorAvailable: true,
        mentorCapacity: 5,
        company: 'Tech Company',
        position: 'Senior Developer'
      });
      
      await user.save();
      console.log('✅ User created successfully!');
    }
    
    console.log('\n📧 Email: tripskhushi000@gmail.com');
    console.log('🔑 Password: Khushi@123');
    console.log('\n✨ Try logging in now!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createUser();
