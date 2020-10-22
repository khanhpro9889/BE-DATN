const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ServiceSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    unitPricing: {
        type: String
    },
    price: {
        type: Number
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

module.exports = Service = mongoose.model(
    'Service',
    ServiceSchema
);

