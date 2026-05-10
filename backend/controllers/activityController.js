const Activity = require('../models/Activity');
const Stop = require('../models/Stop');

//Add activity to stop
const addActivity = async (req, res) => {
    try {
        const { stop, trip, name, category, time, duration, cost, notes } = req.body;

        const activity = await Activity.create({
            stop,
            trip,
            user: req.user._id,
            name,
            category,
            time,
            duration,
            cost,
            currency: 'INR',
            notes,
        });

        //Update stop total cost
        const activities = await Activity.find({ stop });
        const totalCost = activities.reduce((sum, a) => sum += a.cost, 0);
        await Stop.findByIdAndUpdate(stop, { totalCost });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Activities by Stop
const getActivitiesByStop = async (req, res) => {
    try {
        const activities = await Activity.find({ stop: req.params.stopId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Activities by Trip
const getActivitiesByTrip = async (req, res) => {
    try {
        const activities = await Activity.find({ trip: req.params.tripId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Activity
const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        if (activity.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            { ...req.body, currency: 'INR' },
            { new: true }
        );

        // Recalculate stop total cost
        const activities = await Activity.find({ stop: activity.stop });
        const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
        await Stop.findByIdAndUpdate(activity.stop, { totalCost });

        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Activity
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        if (activity.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await activity.deleteOne();

        // Recalculate stop total cost
        const activities = await Activity.find({ stop: activity.stop });
        const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
        await Stop.findByIdAndUpdate(activity.stop, { totalCost });

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addActivity,
    getActivitiesByStop,
    getActivitiesByTrip,
    updateActivity,
    deleteActivity,
};