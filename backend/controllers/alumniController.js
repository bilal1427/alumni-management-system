const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// @desc    Create/Update alumni profile
// @route   POST /api/alumni/profile
// @access  Private/Alumni
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      graduationYear,
      degree,
      currentCompany,
      currentPosition,
      location,
      linkedIn,
      bio,
      skills,
      achievements
    } = req.body;

    // Validation
    if (!graduationYear || !degree) {
      return res.status(400).json({ message: 'Graduation year and degree are required' });
    }

    const profileData = {
      user: req.user._id,
      graduationYear,
      degree,
      currentCompany,
      currentPosition,
      location,
      linkedIn,
      bio,
      skills: Array.isArray(skills) ? skills : [],
      achievements,
      updatedAt: Date.now()
    };

    // Check if profile exists
    let profile = await AlumniProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await AlumniProfile.findOneAndUpdate(
        { user: req.user._id },
        profileData,
        { new: true, runValidators: true }
      ).populate('user', 'name email');
    } else {
      // Create new profile
      profile = await AlumniProfile.create(profileData);
      profile = await profile.populate('user', 'name email');
    }

    res.json({
      message: 'Profile saved successfully',
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while saving profile' });
  }
};

// @desc    Get current alumni profile
// @route   GET /api/alumni/profile
// @access  Private/Alumni
const getMyProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// @desc    Get all alumni profiles
// @route   GET /api/alumni
// @access  Private (All authenticated users)
const getAllAlumni = async (req, res) => {
  try {
    const alumni = await AlumniProfile.find({})
      .populate('user', 'name email isApproved')
      .sort({ graduationYear: -1 });

    // Filter only approved alumni
    const approvedAlumni = alumni.filter(alum => alum.user && alum.user.isApproved);

    res.json(approvedAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching alumni' });
  }
};

// @desc    Get single alumni profile by ID
// @route   GET /api/alumni/:id
// @access  Private
const getAlumniById = async (req, res) => {
  try {
    const profile = await AlumniProfile.findById(req.params.id)
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching alumni profile' });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllAlumni,
  getAlumniById
};
