const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const CategorySchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    updateAt: {
        type: Date,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Conversation = mongoose.model(
    'Category',
    CategorySchema
);

