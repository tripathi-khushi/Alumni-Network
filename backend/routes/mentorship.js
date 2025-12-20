const express = require('express');
const router = express.Router();
const Mentorship = require('../models/Mentorship');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../services/emailService');

// Calculate match score between mentor and mentee
const calculateMatchScore = (mentor, goals) => {
  let score = 0;
  const goalsLower = goals.toLowerCase();
  
  // Check expertise match (40 points)
  if (mentor.expertise && mentor.expertise.length > 0) {
    const expertiseMatches = mentor.expertise.filter(exp => 
      goalsLower.includes(exp.toLowerCase())
    );
    score += (expertiseMatches.length / mentor.expertise.length) * 40;
  }
  
  // Check availability (30 points)
  if (mentor.isMentorAvailable && mentor.activeMentees < mentor.mentorCapacity) {
    score += 30;
  } else if (mentor.isMentorAvailable) {
    score += 15; // Available but near capacity
  }
  
  // Check mentorship preferences (30 points)
  if (mentor.mentorshipPreferences && mentor.mentorshipPreferences.topics) {
    const topicMatches = mentor.mentorshipPreferences.topics.filter(topic =>
      goalsLower.includes(topic.toLowerCase())
    );
    score += (topicMatches.length / Math.max(mentor.mentorshipPreferences.topics.length, 1)) * 30;
  }
  
  return Math.round(score);
};

// Get all mentorship requests (for a specific user)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Mentorship.find({
      $or: [
        { mentorId: req.user.id },
        { menteeId: req.user.id }
      ]
    })
    .populate('mentorId', 'name email role company expertise')
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

    // Check if mentor is available
    if (!mentor.isMentorAvailable) {
      return res.status(400).json({ message: 'This mentor is not currently accepting mentees' });
    }

    // Check mentor capacity
    if (mentor.activeMentees >= mentor.mentorCapacity) {
      return res.status(400).json({ message: 'This mentor has reached their mentee capacity' });
    }

    // Check if request already exists
    const existingRequest = await Mentorship.findOne({
      mentorId,
      menteeId: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending or active request with this mentor' });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(mentor, goals);

    const mentorshipRequest = new Mentorship({
      mentorId,
      menteeId: req.user.id,
      menteeName: name,
      menteeEmail: email,
      goals,
      message,
      matchScore,
    });

    await mentorshipRequest.save();

    // Send email notification to mentor
    const emailTemplate = emailTemplates.mentorshipRequest(
      mentor.name,
      name,
      email,
      goals,
      message
    );
    await sendEmail(mentor.email, emailTemplate);

    res.status(201).json({ 
      message: 'Mentorship request sent successfully',
      request: mentorshipRequest,
      matchScore 
    });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mentorship request status (accept/reject)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

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
    
    if (status === 'accepted') {
      mentorshipRequest.acceptedAt = Date.now();
      // Increment mentor's active mentees count
      await User.findByIdAndUpdate(req.user.id, { $inc: { activeMentees: 1 } });
      
      // Send acceptance email to mentee
      const mentor = await User.findById(req.user.id);
      const mentee = await User.findById(mentorshipRequest.menteeId);
      if (mentee) {
        const emailTemplate = emailTemplates.mentorshipAccepted(
          mentee.name,
          mentee.email,
          mentor.name,
          mentor.email
        );
        await sendEmail(mentee.email, emailTemplate);
      }
    }
    
    if (status === 'rejected' && rejectionReason) {
      mentorshipRequest.rejectionReason = rejectionReason;
      
      // Send rejection email to mentee
      const mentee = await User.findById(mentorshipRequest.menteeId);
      const mentor = await User.findById(req.user.id);
      if (mentee) {
        const emailTemplate = emailTemplates.mentorshipRejected(
          mentee.name,
          mentor.name,
          rejectionReason
        );
        await sendEmail(mentee.email, emailTemplate);
      }
    }
    
    if (status === 'completed') {
      mentorshipRequest.completedAt = Date.now();
      // Decrement mentor's active mentees count
      await User.findByIdAndUpdate(req.user.id, { $inc: { activeMentees: -1 } });
    }

    await mentorshipRequest.save();

    // TODO: Send email notification to mentee

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
    const { expertise, availability } = req.query;
    
    let query = {
      role: { $in: ['mentor', 'admin'] }
    };
    
    // Filter by expertise if provided
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }
    
    // Filter by availability
    if (availability === 'true') {
      query.isMentorAvailable = true;
      query.$expr = { $lt: ['$activeMentees', '$mentorCapacity'] };
    }
    
    const mentors = await User.find(query)
      .select('-password')
      .sort({ activeMentees: 1 }); // Prioritize mentors with fewer mentees
    
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended mentors based on goals
router.post('/recommend', auth, async (req, res) => {
  try {
    const { goals } = req.body;
    
    if (!goals) {
      return res.status(400).json({ message: 'Goals are required' });
    }
    
    // Get all available mentors
    const mentors = await User.find({
      role: { $in: ['mentor', 'admin'] },
      isMentorAvailable: true,
      $expr: { $lt: ['$activeMentees', '$mentorCapacity'] }
    }).select('-password');
    
    // Calculate match scores and sort
    const mentorsWithScores = mentors.map(mentor => ({
      ...mentor.toObject(),
      matchScore: calculateMatchScore(mentor, goals)
    })).sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(mentorsWithScores);
  } catch (error) {
    console.error('Get recommended mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mentor availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { isMentorAvailable, mentorCapacity, availability, mentorshipPreferences } = req.body;
    
    const updateData = {};
    if (typeof isMentorAvailable === 'boolean') updateData.isMentorAvailable = isMentorAvailable;
    if (mentorCapacity) updateData.mentorCapacity = mentorCapacity;
    if (availability) updateData.availability = availability;
    if (mentorshipPreferences) updateData.mentorshipPreferences = mentorshipPreferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Availability updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule a mentorship session
router.post('/:id/schedule', auth, async (req, res) => {
  try {
    const { date, duration, meetingLink, notes } = req.body;
    
    const mentorshipRequest = await Mentorship.findById(req.params.id);
    
    if (!mentorshipRequest) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }
    
    // Verify user is either mentor or mentee
    if (mentorshipRequest.mentorId.toString() !== req.user.id && 
        mentorshipRequest.menteeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    mentorshipRequest.scheduledSessions.push({
      date,
      duration: duration || 60,
      meetingLink,
      notes
    });
    
    await mentorshipRequest.save();
    
    // Send email notifications to both mentor and mentee
    const mentor = await User.findById(mentorshipRequest.mentorId);
    const mentee = await User.findById(mentorshipRequest.menteeId);
    
    if (mentor && mentee) {
      const emailTemplate = emailTemplates.sessionScheduled(
        mentor.name,
        mentor.name,
        mentee.name,
        date,
        duration || 60,
        meetingLink
      );
      await sendEmail(mentor.email, emailTemplate);
      
      const menteeEmailTemplate = emailTemplates.sessionScheduled(
        mentee.name,
        mentor.name,
        mentee.name,
        date,
        duration || 60,
        meetingLink
      );
      await sendEmail(mentee.email, menteeEmailTemplate);
    }
    
    res.json({ 
      message: 'Session scheduled successfully',
      request: mentorshipRequest 
    });
  } catch (error) {
    console.error('Schedule session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
