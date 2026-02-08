const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllAlumni,
  getAlumniById
} = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes for viewing alumni (but still need authentication)
router.get('/', protect, getAllAlumni);
router.get('/:id', protect, getAlumniById);

// Alumni-only routes
router.post('/profile', protect, authorize('alumni'), createOrUpdateProfile);
router.get('/profile/me', protect, authorize('alumni'), getMyProfile);

module.exports = router;
