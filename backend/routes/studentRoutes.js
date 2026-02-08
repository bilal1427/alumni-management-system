const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllStudents
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Student-only routes
router.post('/profile', protect, authorize('student'), createOrUpdateProfile);
router.get('/profile/me', protect, authorize('student'), getMyProfile);

// Admin can view all students
router.get('/', protect, authorize('admin'), getAllStudents);

module.exports = router;
