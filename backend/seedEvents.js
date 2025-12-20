const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('./models/Event');

const sampleEvents = [
  {
    title: "Tech Leadership Summit 2025",
    date: "January 15, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual Event",
    category: "Networking",
    description: "Join industry leaders for insights on modern tech leadership and innovation strategies.",
    attendees: []
  },
  {
    title: "Annual Alumni Reunion",
    date: "February 20, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Campus Auditorium",
    category: "Reunion",
    description: "Reconnect with your batchmates and celebrate memories at our annual reunion.",
    attendees: []
  },
  {
    title: "Career Workshop: AI & ML",
    date: "January 28, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Online",
    category: "Workshop",
    description: "Hands-on workshop covering AI/ML fundamentals and career opportunities.",
    attendees: []
  },
  {
    title: "Startup Pitch Night",
    date: "March 5, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "Innovation Hub",
    category: "Entrepreneurship",
    description: "Watch alumni entrepreneurs pitch their startups and network with investors.",
    attendees: []
  }
];

async function seedEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-network');
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`✅ ${events.length} events added successfully!`);

    console.log('\nEvents created:');
    events.forEach(event => {
      console.log(`- ${event.title} (ID: ${event._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
