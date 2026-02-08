const Mentorship = require('../models/Mentorship');

// @desc    Request mentorship
// @route   POST /api/mentorship/request
// @access  Private/Student
const requestMentorship = async (req, res) => {
  try {
    const { mentorId, domain, message } = req.body;

    if (!mentorId || !domain) {
      return res.status(400).json({ message: 'Mentor and domain are required' });
    }

    // Check if request already exists
    const existingRequest = await Mentorship.findOne({
      mentor: mentorId,
      mentee: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have an active request with this mentor' 
      });
    }

    const mentorship = await Mentorship.create({
      mentor: mentorId,
      mentee: req.user._id,
      domain,
      message
    });

    const populated = await Mentorship.findById(mentorship._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.status(201).json({
      message: 'Mentorship request sent successfully',
      mentorship: populated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while requesting mentorship' });
  }
};

// @desc    Get my mentorship requests (as mentee)
// @route   GET /api/mentorship/my-requests
// @access  Private/Student
const getMyRequests = async (req, res) => {
  try {
    const requests = await Mentorship.find({ mentee: req.user._id })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
};

// @desc    Get mentorship requests (as mentor)
// @route   GET /api/mentorship/requests
// @access  Private/Alumni
const getMentorshipRequests = async (req, res) => {
  try {
    const requests = await Mentorship.find({ mentor: req.user._id })
      .populate('mentee', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching mentorship requests' });
  }
};

// @desc    Update mentorship status
// @route   PUT /api/mentorship/:id
// @access  Private/Alumni
const updateMentorshipStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    // Check if user is the mentor
    if (mentorship.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    mentorship.status = status;
    mentorship.updatedAt = Date.now();
    await mentorship.save();

    const updated = await Mentorship.findById(mentorship._id)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    res.json({
      message: `Mentorship ${status} successfully`,
      mentorship: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating mentorship' });
  }
};

module.exports = {
  requestMentorship,
  getMyRequests,
  getMentorshipRequests,
  updateMentorshipStatus
};
