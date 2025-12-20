const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  menteeName: {
    type: String,
    required: true,
  },
  menteeEmail: {
    type: String,
    required: true,
  },
  goals: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  matchScore: {
    type: Number,
    default: 0, // Algorithm-based compatibility score (0-100)
  },
  scheduledSessions: [{
    date: Date,
    duration: Number, // in minutes
    meetingLink: String,
    notes: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  rejectionReason: String,
  feedback: {
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    menteeRating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  completedAt: Date,
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
