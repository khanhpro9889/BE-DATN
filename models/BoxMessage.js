const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const BoxMessageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    question: {
        type: String
    },
    answer: {
        type: String
    },
    createAt: {
        type: Date,
        default: new Date()
    }
});

module.exports = Conversation = mongoose.model(
    'BoxMessage',
    BoxMessageSchema
);

