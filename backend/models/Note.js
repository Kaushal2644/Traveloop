const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
    stop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Stop', 
        default: null 
    },
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        default: '' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);