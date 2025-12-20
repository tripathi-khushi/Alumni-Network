const mongoose = require('mongoose');
const Mentorship = require('./models/Mentorship');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-network')
  .then(async () => {
    console.log('=== MENTORSHIP REQUESTS ===');
    const requests = await Mentorship.find();
    console.log('Total requests:', requests.length);
    requests.forEach(r => console.log('Request:', r.menteeName, '->', r.status));
    
    console.log('\n=== MENTOR AVAILABILITY ===');
    const mentors = await User.find({ isMentorAvailable: true });
    mentors.forEach(m => console.log(`${m.name}: Available=${m.isMentorAvailable}, Capacity=${m.mentorCapacity}, Active=${m.activeMentees || 0}`));
    
    console.log('\n=== ALL USERS WITH MENTOR FIELDS ===');
    const allUsers = await User.find({}, 'name isMentorAvailable mentorCapacity activeMentees');
    allUsers.forEach(u => console.log(`${u.name}: Available=${u.isMentorAvailable}, Cap=${u.mentorCapacity}, Active=${u.activeMentees || 0}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
