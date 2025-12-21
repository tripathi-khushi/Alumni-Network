const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createMentor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-network');
    console.log('✅ MongoDB Connected');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'tripathikhushi000@gmail.com' });
    
    if (existingUser) {
      console.log('⚠️  User already exists, updating to mentor...');
      
      // Reset password (let the pre-save hook hash it)
      existingUser.password = 'password123';
      
      // Update existing user to be a mentor
      existingUser.role = 'mentor';
      existingUser.isMentorAvailable = true;
      existingUser.mentorCapacity = 5;
      existingUser.activeMentees = 0;
      existingUser.expertise = ['Cloud Architecture', 'DevOps', 'System Design', 'AWS', 'Docker'];
      existingUser.company = 'Tech Corp';
      existingUser.position = 'Senior Cloud Architect';
      existingUser.batch = 'Class of 2018';
      
      await existingUser.save();
      console.log('✅ User updated to mentor successfully!');
      console.log('📧 Email:', existingUser.email);
      console.log('🔑 Password: password123');
      console.log('👤 Name:', existingUser.name);
      console.log('🎓 Role:', existingUser.role);
    } else {
      // Create new mentor user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const mentor = new User({
        name: 'Khushi Mentor',
        email: 'tripathikhushi000@gmail.com',
        password: hashedPassword,
        role: 'mentor',
        batch: 'Class of 2018',
        company: 'Tech Corp',
        position: 'Senior Cloud Architect',
        bio: 'Experienced cloud architect with 7+ years in the industry. Passionate about mentoring and helping others grow.',
        expertise: ['Cloud Architecture', 'DevOps', 'System Design', 'AWS', 'Docker'],
        isMentorAvailable: true,
        mentorCapacity: 5,
        activeMentees: 0,
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          timeSlots: ['Evening (6-8 PM)']
        },
        mentorshipPreferences: {
          topics: ['Cloud Architecture', 'DevOps', 'Career Growth'],
          sessionDuration: 60,
          preferredMode: 'Virtual'
        }
      });

      await mentor.save();
      console.log('✅ Mentor account created successfully!');
      console.log('📧 Email: tripathikhushi000@gmail.com');
      console.log('🔑 Password: password123');
      console.log('👤 Name: Khushi Mentor');
      console.log('🎓 Role: mentor');
      console.log('💼 Expertise: Cloud Architecture, DevOps, System Design, AWS, Docker');
      console.log('\n📌 You can now login with these credentials!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createMentor();
