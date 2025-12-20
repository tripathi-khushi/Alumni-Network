const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const sampleMentors = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2015",
    company: "Tech Corp",
    position: "Senior Software Engineer",
    expertise: ["Career Growth", "Technical Skills", "Leadership", "JavaScript", "React"],
    bio: "Passionate about helping early-career developers transition into tech leadership roles.",
    isMentorAvailable: true,
    mentorCapacity: 5,
    activeMentees: 0,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      timeSlots: ["6:00 PM - 8:00 PM", "9:00 AM - 11:00 AM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["Career Development", "Technical Interview Prep", "Leadership Skills"],
      experienceLevel: ["beginner", "intermediate"],
      sessionDuration: 60
    }
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2013",
    company: "Innovation Labs",
    position: "Product Manager",
    expertise: ["Product Strategy", "Entrepreneurship", "Networking", "Business Development"],
    bio: "Former entrepreneur helping alumni launch and scale their startups.",
    isMentorAvailable: true,
    mentorCapacity: 4,
    activeMentees: 0,
    availability: {
      days: ["Tuesday", "Thursday"],
      timeSlots: ["7:00 PM - 9:00 PM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["Product Management", "Startup Strategy", "Fundraising"],
      experienceLevel: ["intermediate", "advanced"],
      sessionDuration: 90
    }
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2016",
    company: "AI Solutions",
    position: "Data Scientist",
    expertise: ["Data Science", "Machine Learning", "Research", "Python", "AI"],
    bio: "Helping students transition from academia to industry data science roles.",
    isMentorAvailable: true,
    mentorCapacity: 6,
    activeMentees: 0,
    availability: {
      days: ["Monday", "Tuesday", "Thursday", "Saturday"],
      timeSlots: ["5:00 PM - 7:00 PM", "10:00 AM - 12:00 PM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["Machine Learning", "Data Analysis", "Career in AI", "Research Papers"],
      experienceLevel: ["beginner", "intermediate", "advanced"],
      sessionDuration: 60
    }
  },
  {
    name: "David Kumar",
    email: "david.kumar@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2012",
    company: "Global Consulting",
    position: "Senior Consultant",
    expertise: ["Business Strategy", "Consulting", "Finance", "MBA Prep"],
    bio: "Helping alumni break into consulting and navigate corporate careers.",
    isMentorAvailable: true,
    mentorCapacity: 3,
    activeMentees: 0,
    availability: {
      days: ["Wednesday", "Saturday"],
      timeSlots: ["8:00 AM - 10:00 AM", "6:00 PM - 8:00 PM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["Management Consulting", "Case Interview Prep", "Career Transitions"],
      experienceLevel: ["beginner", "intermediate"],
      sessionDuration: 60
    }
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2014",
    company: "Design Studio",
    position: "UX Design Lead",
    expertise: ["UX Design", "Product Design", "Design Thinking", "Figma", "User Research"],
    bio: "Passionate about mentoring aspiring designers and helping them build strong portfolios.",
    isMentorAvailable: true,
    mentorCapacity: 5,
    activeMentees: 0,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      timeSlots: ["7:00 PM - 9:00 PM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["UX Design", "Portfolio Building", "Design Career Path"],
      experienceLevel: ["beginner", "intermediate"],
      sessionDuration: 60
    }
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    password: "password123",
    role: "mentor",
    batch: "Class of 2011",
    company: "CloudTech Inc",
    position: "DevOps Engineer",
    expertise: ["DevOps", "Cloud Computing", "AWS", "Docker", "Kubernetes"],
    bio: "Helping developers understand cloud infrastructure and DevOps practices.",
    isMentorAvailable: true,
    mentorCapacity: 4,
    activeMentees: 0,
    availability: {
      days: ["Tuesday", "Thursday", "Sunday"],
      timeSlots: ["6:00 PM - 8:00 PM"],
      preferredMeetingType: "video"
    },
    mentorshipPreferences: {
      topics: ["Cloud Architecture", "DevOps Practices", "System Design"],
      experienceLevel: ["intermediate", "advanced"],
      sessionDuration: 60
    }
  }
];

async function seedMentors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-network');
    console.log('Connected to MongoDB');

    // Clear existing mentors (optional - comment out if you want to keep existing users)
    await User.deleteMany({ role: 'mentor' });
    console.log('Cleared existing mentors');

    // Insert sample mentors
    const mentors = await User.insertMany(sampleMentors);
    console.log(`✅ ${mentors.length} mentors added successfully!`);

    console.log('\nMentors created:');
    mentors.forEach(mentor => {
      console.log(`- ${mentor.name} (${mentor.position} at ${mentor.company})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding mentors:', error);
    process.exit(1);
  }
}

seedMentors();
