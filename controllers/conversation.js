const Conversation = require('../models/Conversation');
const Gym = require('../models/Gym');
const mongoose = require("mongoose");
const User = require('../models/User');

exports.addConversation = async (req, res, next) => {
    const { user1, user2, gym } = req.body;
    try {
        const findedConversation = await Conversation.find({user1: user1, user2: user2, gym: gym})
        .populate({ path: 'user2', model: User })
        .populate({ path: 'user1', model: User })
        .populate({ path: 'gym', model: Gym});;
        if (findedConversation.length > 0) {
            return res.status(200).json({message: 'Conversation exists', conversation: findedConversation[0]});
        }
        const newConversation = new Conversation({
            _id: new mongoose.Types.ObjectId(),
            user1,
            user2,
            gym,
            createAt: new Date()
        });
        await newConversation.save();
        const finded = await Conversation.findById(newConversation._id)
        .populate({ path: 'user2', model: User })
        .populate({ path: 'user1', model: User })
        .populate({ path: 'gym', model: Gym});
        res.status(200).json({message: 'Add conversation successfully', conversation: finded});
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getConversationById = async (req, res, next) => {
    const { uid } = req.params;
    try {
        //const findedConversation =  await Conversation.find().populate({ path: 'user1', model: User });
        const findedConversation =  await Conversation.find({ $or: [{'user1': uid}, {'user2': uid}]})
        .populate({ path: 'user2', model: User })
        .populate({ path: 'user1', model: User })
        .populate({ path: 'gym', model: Gym});
        res.status(200).json({conversations: findedConversation});
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}