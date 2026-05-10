const express = require("express");
const router = express.Router();
const { addNote, getNotesByTrip, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addNote);
router.get('/trip:tripId', protect, getNotesByTrip);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;