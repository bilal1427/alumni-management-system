const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes (authenticated users)
router.get('/', protect, getAllJobs);
router.get('/:id', protect, getJobById);

// Alumni-only routes
router.post('/', protect, authorize('alumni'), createJob);
router.get('/my/jobs', protect, authorize('alumni'), getMyJobs);
router.put('/:id', protect, authorize('alumni'), updateJob);
router.delete('/:id', protect, authorize('alumni', 'admin'), deleteJob);

module.exports = router;
