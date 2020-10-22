const mongoose = require('mongoose');

const utilitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    createAt: {
        type: Date
    },
    updateAt: {
        type: Date
    }
});

module.exports = mongoose.model('Utility', utilitySchema);