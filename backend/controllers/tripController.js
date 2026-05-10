const Trip = require('../models/Trip');

// Create Trip
const createTrip = async (req, res) => {
    try {
        const { name, description, startDate, endDate, budget, currency, coverPhoto } = req.body;

        const trip = await Trip.create({
            user: req.user._id,
            name,
            description,
            startDate,
            endDate,
            budget,
            currency,
            coverPhoto,
        });

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All My Trips
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Trip
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        // Allow if owner or public
        if (trip.user.toString() !== req.user._id.toString() && !trip.isPublic) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Trip
const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Trip
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await trip.deleteOne();
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Public Trips (Shared)
const getPublicTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ isPublic: true })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle Public/Private
const togglePublic = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        trip.isPublic = !trip.isPublic;
        await trip.save();

        res.json({ message: `Trip is now ${trip.isPublic ? 'public' : 'private'}`, isPublic: trip.isPublic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getPublicTrips,
    togglePublic,
};