const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const ConversationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        default: null,
    },
    addresses: 
        {
            province: {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref: 'Province'
            },
            district: {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref: 'District'
            },
            address: {
                default: null,
                type: String
            },
            lat: {
                default: null,
                type: String
            },
            lng: {
                default: null,
                type: String
            }
        },
    facebooks: [
        {
            _id: {
                type: Number
            },
            web: {
                type: String
            }
        }
    ],
    phones: [
        {
            _id: {
                type: Number
            },
            phone: {
                type: String
            }
        }
    ],
    content: {
        type: String,
        default: null,
    },
    gallery: [
        {
            _id: {
                type: Number
            },
            path: { 
                type: String 
            } 
        }
    ],
    utilities: [
        {
            _id: {
                type: Number
            },
            utility: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Utility'
            }
        }
    ],
    times: [
        {
            fromDay: {
                type: String
            },
            toDay: {
                type: String
            },
            openTime: {
                type: String
            },
            closeTime: {
                type: String
            },
            _id: {
                type: String
            }
        }
    ],
    services: [
        {
            _id: {
                type: String
            },
            name: {
                type: String
            },
            description: {
                type: String,
                default: null,
            }
        }
    ],
    holiday: {
        type: Boolean,
        default: false
    },
    approve: {
        type: Boolean,
        default: false
    },
    complete: {
        type: Boolean,
        default: false
    },
    totalViews: {
        type: Number,
        default: 0
    },
    weekViews: {
        view: {
            quantity: {
                type: Number,
                default: 0,
            },
            week: {
                type: Number,
                default: 0,
            }
        }
    },
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

