const Note = require('../models/Note');

// Add Note
const addNote = async (req, res) => {
    try {
        const { trip, stop, title, content } = req.body;

        const note = await Note.create({
            trip,
            user: req.user._id,
            stop: stop || null,
            title,
            content,
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Notes by Trip
const getNotesByTrip = async (req, res) => {
    try {
        const notes = await Note.find({ trip: req.params.tripId })
            .populate('stop', 'city')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Note
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Note
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addNote, getNotesByTrip, updateNote, deleteNote };