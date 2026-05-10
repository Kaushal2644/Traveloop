const express = require('express');
const router = express.Router();
const {
  addActivity,
  getActivitiesByStop,
  getActivitiesByTrip,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addActivity);
router.get('/stop/:stopId', protect, getActivitiesByStop);
router.get('/trip/:tripId', protect, getActivitiesByTrip);
router.put('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

module.exports = router;