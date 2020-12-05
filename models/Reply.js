const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    createAt: {
        type: Date
    },
    updateAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Reply', replySchema);