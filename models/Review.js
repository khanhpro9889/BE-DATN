const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    replyQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number
    },
    createAt: {
        type: Date
    },
    updateAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Review', reviewSchema);