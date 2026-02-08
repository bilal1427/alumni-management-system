const Event = require('../models/Event');

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      eventTime,
      venue,
      eventType,
      registrationLink,
      maxParticipants
    } = req.body;

    // Validation
    if (!title || !description || !eventDate || !eventTime || !venue) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    const event = await Event.create({
      createdBy: req.user._id,
      title,
      description,
      eventDate,
      eventTime,
      venue,
      eventType,
      registrationLink,
      maxParticipants
    });

    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private (All authenticated users)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ eventDate: 1 });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
