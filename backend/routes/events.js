const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const { name, email, phone, attendeeCount } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.attendees.some(
      attendee => attendee.email === email || (attendee.user && attendee.user.toString() === req.user.id)
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.attendees.push({
      user: req.user.id,
      name,
      email,
      phone,
      attendeeCount: parseInt(attendeeCount),
    });

    await event.save();

    res.json({ 
      message: 'Successfully registered for event',
      event 
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (admin only for now)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's registered events
router.get('/user/registered', auth, async (req, res) => {
  try {
    const events = await Event.find({
      'attendees.user': req.user.id
    });
    res.json(events);
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
