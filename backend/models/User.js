const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  batch: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'mentor', 'admin'],
    default: 'user',
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  company: String,
  position: String,
  expertise: [String],
  // Mentor-specific fields
  isMentorAvailable: {
    type: Boolean,
    default: false,
  },
  mentorCapacity: {
    type: Number,
    default: 5, // Maximum number of mentees
  },
  activeMentees: {
    type: Number,
    default: 0,
  },
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [String], // e.g., "9:00 AM - 11:00 AM"
    preferredMeetingType: {
      type: String,
      enum: ['video', 'audio', 'chat', 'in-person'],
      default: 'video'
    }
  },
  mentorshipPreferences: {
    topics: [String], // Specific topics they can mentor on
    experienceLevel: [{
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }],
    sessionDuration: {
      type: Number,
      default: 60 // in minutes
    }
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
