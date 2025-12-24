const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Mentorship = require('../models/Mentorship');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get messages for a specific mentorship
router.get('/mentorship/:mentorshipId', auth, async (req, res) => {
  try {
    const { mentorshipId } = req.params;

    // Verify user is part of this mentorship
    const mentorship = await Mentorship.findById(mentorshipId);
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship not found' });
    }

    const userId = req.user.id;
    if (mentorship.mentorId.toString() !== userId && mentorship.menteeId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all messages for this mentorship
    const messages = await Message.find({ mentorshipId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ createdAt: 1 });

    // Mark messages as read if the current user is the receiver
    await Message.updateMany(
      { 
        mentorshipId, 
        receiverId: userId, 
        read: false 
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { mentorshipId, receiverId, content } = req.body;

    console.log('Send message request:', { mentorshipId, receiverId, userId: req.user.id });

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify user is part of this mentorship
    const mentorship = await Mentorship.findById(mentorshipId);
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship not found' });
    }

    const userId = req.user.id;
    
    // Get the actual ID strings (handle both populated and non-populated cases)
    const mentorIdStr = typeof mentorship.mentorId === 'object' 
      ? mentorship.mentorId._id.toString() 
      : mentorship.mentorId.toString();
    const menteeIdStr = typeof mentorship.menteeId === 'object' 
      ? mentorship.menteeId._id.toString() 
      : mentorship.menteeId.toString();

    console.log('Mentorship check:', { mentorIdStr, menteeIdStr, userId });

    if (mentorIdStr !== userId && menteeIdStr !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify receiver is the other person in the mentorship
    const expectedReceiverId = mentorIdStr === userId ? menteeIdStr : mentorIdStr;
    
    if (receiverId !== expectedReceiverId) {
      return res.status(400).json({ message: 'Invalid receiver' });
    }

    // Create message
    const message = new Message({
      mentorshipId,
      senderId: userId,
      receiverId,
      content: content.trim(),
    });

    await message.save();

    // Populate sender info
    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');

    console.log('Message saved successfully:', message._id);

    // Create notification for receiver
    try {
      const notification = new Notification({
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `${message.senderId.name} sent you a message`,
        relatedId: mentorshipId,
        relatedModel: 'Mentorship',
      });
      await notification.save();
      console.log('Notification created successfully');
    } catch (notifError) {
      console.error('Error creating notification:', notifError.message);
      // Continue even if notification fails
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    console.error('Error details:', error.message);
    if (error.stack) console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/mark-read/:mentorshipId', auth, async (req, res) => {
  try {
    const { mentorshipId } = req.params;

    await Message.updateMany(
      { 
        mentorshipId, 
        receiverId: req.user.id, 
        read: false 
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
