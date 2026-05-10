const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
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
        enum: ['documents', 'clothing', 'electronics', 'toiletries', 'medicine', 'other'],
        default: 'other'
    },
    isPacked: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

module.exports = mongoose.model('PackingItem', packingItemSchema);