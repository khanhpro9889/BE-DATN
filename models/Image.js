const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ImageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    path: {
        type: String
    },
    Post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Conversation = mongoose.model(
    'Image',
    ImageSchema
);

