const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ConversationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    unread1: {
        type: Boolean,
        default: false
    },
    unread2: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: String,
        default: Date.now,
    }
});

module.exports = Conversation = mongoose.model(
    'conversation',
    ConversationSchema
);
