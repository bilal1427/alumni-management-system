const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  approveAlumni,
  rejectAlumni,
  getStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/approve/:id', approveAlumni);
router.put('/reject/:id', rejectAlumni);
router.get('/stats', getStats);

module.exports = router;
