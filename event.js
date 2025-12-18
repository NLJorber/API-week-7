const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Med'
    },
    notes: { type: String },
    user: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
