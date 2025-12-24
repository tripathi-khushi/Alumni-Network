const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  mentorshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentorship',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
  }],
}, {
  timestamps: true,
});

// Index for faster queries
messageSchema.index({ mentorshipId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
