const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllTrips,
  deleteUser,
  makeAdmin,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/trips', protect, adminOnly, getAllTrips);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.patch('/users/:id/make-admin', protect, adminOnly, makeAdmin);

module.exports = router;