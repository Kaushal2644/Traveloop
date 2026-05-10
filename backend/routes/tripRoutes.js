const express = require("express");
const router = express.Router();
const {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getPublicTrips,
    togglePublic,
} = require('../controllers/tripController');
const {protect} = require("../middleware/authMiddleware");

router.get('/public', protect, getPublicTrips);
router.post('/', protect, createTrip);
router.get('/', protect, getMyTrips);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.patch('/:id/toggle-public', protect, togglePublic);

module.exports = router;