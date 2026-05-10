const express = require("express");
const router = express.Router();
const { addStop, getStopsByTrip, updateStop, deleteStop } = require("../controllers/stopController");
const { protect } = require("../middleware/authMiddleware");

router.post('/', protect, addStop);
router.get('/trip/:tripId', protect, getStopsByTrip);
router.put('/:id', protect, updateStop);
router.delete('/:id', protect, deleteStop);

module.exports = router;