const Stop = require("../models/Stop");
const Activity = require("../models/Activity");

// Add Stop to Trip
const addStop = async (req, res) => {
  try {
    const { trip, city, country, startDate, endDate, latitude, longitude, order } = req.body;

    const stop = await Stop.create({
      trip,
      user: req.user._id,
      city,
      country,
      startDate,
      endDate,
      latitude,
      longitude,
      order,
    });

    res.status(201).json(stop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Stops for a Trip
const getStopsByTrip = async (req, res) => {
  try {
    const stops = await Stop.find({ trip: req.params.tripId }).sort({ order: 1 });
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Stop
const updateStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    if (stop.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedStop = await Stop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Stop
const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    if (stop.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all activities under this stop
    await Activity.deleteMany({ stop: req.params.id });
    await stop.deleteOne();

    res.json({ message: 'Stop and its activities deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addStop, getStopsByTrip, updateStop, deleteStop };