const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    stop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Stop', 
        required: true 
    },
    trip: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trip', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    category: {
        type: String,
        enum: ['sightseeing', 'food', 'culture', 'adventure', 'shopping', 'transport', 'stay', 'other'],
        default: 'sightseeing'
    },
    time: { 
        type: String, 
        default: '' 
    },
    duration: { 
        type: Number, 
        default: 1 
    },
    cost: { 
        type: Number, 
        default: 0 
    },
    currency: { 
        type: String, 
        default: 'INR' 
    },
    notes: { 
        type: String, 
        default: '' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);