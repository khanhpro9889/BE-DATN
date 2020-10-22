const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ConversationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        ref: 'user'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    address: {
        type: String
    },
    facebook: {
        type: String
    },
    phone: {
        type: String
    },
    content: {
        type: String
    },
    gallery: [
        {path: { type: String } }
    ],
    utilities: [
        {
            utility: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Utility'
            }
        }
    ],
    updateAt: {
        type: Date,
        default: null
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Conversation = mongoose.model(
    'Gym',
    ConversationSchema
);

