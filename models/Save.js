const mongoose = require('mongoose');

const saveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date
    }
});

module.exports = mongoose.model('Save', saveSchema);