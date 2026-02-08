const express = require('express');
const router = express.Router();
const {
  requestMentorship,
  getMyRequests,
  getMentorshipRequests,
  updateMentorshipStatus
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Student routes
router.post('/request', protect, authorize('student'), requestMentorship);
router.get('/my-requests', protect, authorize('student'), getMyRequests);

// Alumni routes
router.get('/requests', protect, authorize('alumni'), getMentorshipRequests);
router.put('/:id', protect, authorize('alumni'), updateMentorshipStatus);

module.exports = router;
