const express = require('express');
const router = express.Router();
const Mentorship = require('../models/Mentorship');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all mentorship requests (for a specific user)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Mentorship.find({
      $or: [
        { mentorId: req.user.id },
        { menteeId: req.user.id }
      ]
    })
    .populate('mentorId', 'name email role company')
    .populate('menteeId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Get mentorship requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create mentorship request
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, name, email, goals, message } = req.body;

    // Validate mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if request already exists
    const existingRequest = await Mentorship.findOne({
      mentorId,
      menteeId: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this mentor' });
    }

    const mentorshipRequest = new Mentorship({
      mentorId,
      menteeId: req.user.id,
      menteeName: name,
      menteeEmail: email,
      goals,
      message,
    });

    await mentorshipRequest.save();

    res.status(201).json({ 
      message: 'Mentorship request sent successfully',
      request: mentorshipRequest 
    });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mentorship request status (accept/reject)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const mentorshipRequest = await Mentorship.findById(req.params.id);
    
    if (!mentorshipRequest) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    // Ensure only the mentor can update status
    if (mentorshipRequest.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    mentorshipRequest.status = status;
    mentorshipRequest.updatedAt = Date.now();
    await mentorshipRequest.save();

    res.json({ 
      message: `Mentorship request ${status}`,
      request: mentorshipRequest 
    });
  } catch (error) {
    console.error('Update mentorship status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all mentors (users with mentor role or experience)
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({
      role: { $in: ['mentor', 'admin'] }
    }).select('-password');
    
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
