const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
//req.io.sockets.emit('messages', req.body.body);
const mongoose = require('mongoose');

exports.getMessageByConversation = async (req, res, next) => {
    const { conversationId } = req.params;
    const { uid, page } = req.query;
    try {
        const allMessages = await Message.find({conversation: conversationId})
        const findedMessages = await Message.find({conversation: conversationId})
        .populate({ path: 'receiver', model: User })
        .populate({ path: 'sender', model: User }).sort({$natural: -1}).limit(page * 10);
        const finalMessages = findedMessages.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
        const conversation = await Conversation.findById(conversationId);
        if(uid.toString() === conversation.user1.toString()) {
            await Conversation.updateOne({_id: conversationId}, {unread1: false});
            res.status(200).json({messages: finalMessages, length: allMessages.length});
        }
        if(uid.toString() === conversation.user2.toString()) {
            await Conversation.updateOne({_id: conversationId}, {unread2: false});
            res.status(200).json({messages: finalMessages, length: allMessages.length});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}

exports.addMessage = async (req, res, next) => {
    const { sender, receiver, body, conversationId } = req.body;
    const image = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;
    const conversation = await Conversation.findById(conversationId);
    const newMessage = new Message({
        _id: new mongoose.Types.ObjectId(),
        conversation: conversationId,
        sender,
        receiver,
        body: body || null,
        image,
        createAt: new Date()
    })
    try {
        await newMessage.save();
        req.io.sockets.emit(`messages ${conversationId}`, conversationId);
        req.io.sockets.emit(`conversations ${sender}`, conversationId);
        req.io.sockets.emit(`conversations ${receiver}`, conversationId);
        if (sender.toString() === conversation.user1.toString()) {
            console.log('a');
            await Conversation.updateOne({_id: conversationId }, {unread2: true, unread1: false})
            return res.status(200).json({messages: 'successfully'})
        }
        if (sender.toString() === conversation.user2.toString()) {
            console.log('b')
            await Conversation.updateOne({_id: conversationId }, {unread2: false, unread1: true})
            return res.status(200).json({messages: 'successfully'})
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}

exports.deleteMessage = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Message.deleteOne({_id: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({err});
    }
}