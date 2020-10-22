const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const MessageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversation',
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    body: {
        type: String,
    },
    image: {
        type: String,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Message = mongoose.model('message', MessageSchema);
