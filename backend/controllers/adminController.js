const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// @desc    Approve alumni account
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
const approveAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'alumni') {
      return res.status(400).json({ message: 'Only alumni accounts need approval' });
    }

    user.isApproved = true;
    await user.save();

    res.json({
      message: 'Alumni account approved successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while approving alumni' });
  }
};

// @desc    Reject alumni account
// @route   PUT /api/admin/reject/:id
// @access  Private/Admin
const rejectAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'alumni') {
      return res.status(400).json({ message: 'Only alumni accounts can be rejected' });
    }

    // You can either delete the account or mark as rejected
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Alumni account rejected and removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while rejecting alumni' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlumni = await User.countDocuments({ role: 'alumni', isApproved: true });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingApprovals = await User.countDocuments({ role: 'alumni', isApproved: false });

    res.json({
      totalUsers,
      totalAlumni,
      totalStudents,
      pendingApprovals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};

module.exports = {
  getAllUsers,
  approveAlumni,
  rejectAlumni,
  getStats
};
