const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Event = require('../models/Event');
const Mentorship = require('../models/Mentorship');
const auth = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (alumni directory)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me/profile', auth, async (req, res) => {
  try {
    const {
      name, email, batch, company, position, bio, expertise,
      isMentorAvailable, mentorCapacity, availability, mentorshipPreferences,
      linkedin, github, website
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (batch) user.batch = batch;
    if (company) user.company = company;
    if (position) user.position = position;
    if (bio) user.bio = bio;
    if (expertise) user.expertise = expertise;
    if (typeof isMentorAvailable === 'boolean') user.isMentorAvailable = isMentorAvailable;
    if (mentorCapacity) user.mentorCapacity = mentorCapacity;
    if (availability) user.availability = availability;
    if (mentorshipPreferences) user.mentorshipPreferences = mentorshipPreferences;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (website) user.website = website;

    await user.save();
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts
router.get('/me/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'name email batch')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's event registrations
router.get('/me/events', auth, async (req, res) => {
  try {
    const events = await Event.find({ 'attendees.user': req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's mentorship requests
router.get('/me/mentorships', auth, async (req, res) => {
  try {
    const mentorships = await Mentorship.find({
      $or: [{ mentorId: req.user.id }, { menteeId: req.user.id }]
    })
    .populate('mentorId', 'name email company position')
    .populate('menteeId', 'name email')
    .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (error) {
    console.error('Get user mentorships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/me/stats', auth, async (req, res) => {
  try {
    const [postsCount, eventsCount, mentorshipsCount] = await Promise.all([
      Post.countDocuments({ author: req.user.id }),
      Event.countDocuments({ 'attendees.user': req.user.id }),
      Mentorship.countDocuments({ $or: [{ mentorId: req.user.id }, { menteeId: req.user.id }] })
    ]);

    res.json({ posts: postsCount, events: eventsCount, mentorships: mentorshipsCount });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
