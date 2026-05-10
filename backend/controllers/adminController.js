const User = require('../models/User');
const Trip = require('../models/Trip');
const Stop = require('../models/Stop');
const Activity = require('../models/Activity');

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTrips = await Trip.countDocuments();
        const totalStops = await Stop.countDocuments();
        const totalActivities = await Activity.countDocuments();

        // Top Cities
        const topCities = await Stop.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        // Activity Categories
        const activityCategories = await Activity.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Trips per month
        const tripsPerMonth = await Trip.aggregate([
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 },
        ]);

        res.json({
            totalUsers,
            totalTrips,
            totalStops,
            totalActivities,
            topCities,
            activityCategories,
            tripsPerMonth,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Trips
const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Make User Admin
const makeAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        res.json({ message: `User is now ${user.role}`, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllTrips,
    deleteUser,
    makeAdmin,
};