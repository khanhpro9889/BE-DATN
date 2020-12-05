const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const NotificationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: Number
    },
    unread: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    createAt: {
        type: Date,
        default: new Date()
    }
});

module.exports = Conversation = mongoose.model(
    'Notification',
    NotificationSchema
);

