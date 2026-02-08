const StudentProfile = require('../models/StudentProfile');

// @desc    Create/Update student profile
// @route   POST /api/student/profile
// @access  Private/Student
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      enrollmentYear,
      degree,
      semester,
      branch,
      skills,
      interests
    } = req.body;

    // Validation
    if (!enrollmentYear || !degree || !semester || !branch) {
      return res.status(400).json({ 
        message: 'Enrollment year, degree, semester, and branch are required' 
      });
    }

    const profileData = {
      user: req.user._id,
      enrollmentYear,
      degree,
      semester,
      branch,
      skills: Array.isArray(skills) ? skills : [],
      interests,
      updatedAt: Date.now()
    };

    // Check if profile exists
    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        profileData,
        { new: true, runValidators: true }
      ).populate('user', 'name email');
    } else {
      // Create new profile
      profile = await StudentProfile.create(profileData);
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

// @desc    Get current student profile
// @route   GET /api/student/profile
// @access  Private/Student
const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id })
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

// @desc    Get all students
// @route   GET /api/student
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find({})
      .populate('user', 'name email')
      .sort({ enrollmentYear: -1 });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllStudents
};
