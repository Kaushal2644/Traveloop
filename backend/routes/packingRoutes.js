const express = require('express');
const router = express.Router();
const {
    addPackingItem,
    getPackingItemsByTrip,
    togglePacked,
    updatePackingItem,
    deletePackingItem,
    resetPackingList,
} = require('../controllers/packingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addPackingItem);
router.get('/trip/:tripId', protect, getPackingItemsByTrip);
router.patch('/:id/toggle', protect, togglePacked);
router.put('/:id', protect, updatePackingItem);
router.delete('/:id', protect, deletePackingItem);
router.patch('/trip/:tripId/reset', protect, resetPackingList);

module.exports = router;