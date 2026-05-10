const PackingItem = require('../models/PackingItem');

// Add Packing Item
const addPackingItem = async (req, res) => {
    try {
        const { trip, name, category } = req.body;

        const item = await PackingItem.create({
            trip,
            user: req.user._id,
            name,
            category,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Packing Items by Trip
const getPackingItemsByTrip = async (req, res) => {
    try {
        const items = await PackingItem.find({ trip: req.params.tripId })
            .sort({ category: 1, createdAt: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle Packed Status
const togglePacked = async (req, res) => {
    try {
        const item = await PackingItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        item.isPacked = !item.isPacked;
        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Packing Item
const updatePackingItem = async (req, res) => {
    try {
        const item = await PackingItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedItem = await PackingItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Packing Item
const deletePackingItem = async (req, res) => {
    try {
        const item = await PackingItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await item.deleteOne();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset All Items (mark all as unpacked)
const resetPackingList = async (req, res) => {
    try {
        await PackingItem.updateMany(
            { trip: req.params.tripId, user: req.user._id },
            { isPacked: false }
        );
        res.json({ message: 'Packing list reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPackingItem,
    getPackingItemsByTrip,
    togglePacked,
    updatePackingItem,
    deletePackingItem,
    resetPackingList,
};