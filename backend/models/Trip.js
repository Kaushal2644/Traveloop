const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
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
    budget: { 
        type: Number, 
        default: 0 
    },
    currency: { 
        type: String, 
        default: 'INR' 
    },
    coverPhoto: { 
        type: String, 
        default: '' 
    },
    status: {
        type: String,
        enum: ['planning', 'upcoming', 'ongoing', 'completed'],
        default: 'planning'
    },
    isPublic: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);