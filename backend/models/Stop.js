const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
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
    city: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        default: '' 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    latitude: { 
        type: Number, 
        default: null 
    },
    longitude: { 
        type: Number, 
        default: null 
    },
    order: { 
        type: Number, 
        default: 0 
    },
    totalCost: { 
        type: Number, 
        default: 0 
    },
}, { timestamps: true });

module.exports = mongoose.model('Stop', stopSchema);