const mongoose = require("mongoose");
const Reply = require('../models/Reply');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Review = require('../models/Review');

exports.getAllRepliesByReview = async (req, res, next) => {
    const { id } = req.params;
    //const { page } = req.query;
    try {
        const Replies = await Reply.find({review: id}).populate({path: 'author', model: User});
        res.status(200).json({replies: Replies});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.addReply = async (req, res, next) => {
    const { review, message, author, reviewUser, gym } = req.body;
    try {
        const newReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            body: message,
            review,
            author,
            createAt: new Date()
        })
        await newReply.save();
        const findedReview = await Review.findById(review);
        await Review.updateOne({_id: review}, {replyQuantity: findedReview.replyQuantity + 1})
        if (author.toString() !== reviewUser.toString()) {
            const findedNoti = await Notification.find({user: reviewUser, type: 2, unread: true});
            var newNoti;
            if (findedNoti.length > 0) {
                await Notification.updateOne({_id: findedNoti[0]._id}, {
                    gym: gym,
                    user: reviewUser,
                    type: 2,
                    quantity: findedNoti[0].quantity + 1,
                    unread: true,
                    createAt: new Date()
                })
                req.io.sockets.emit(`notification ${reviewUser}`, reviewUser);
            } else {
                newNoti = new Notification({
                    _id: new mongoose.Types.ObjectId(),
                    gym: gym,
                    user: reviewUser,
                    type: 2,
                    quantity: 1,
                    unread: true,
                    createAt: new Date()
                })
                await newNoti.save();
                req.io.sockets.emit(`notification ${reviewUser}`, reviewUser);
            }
        }
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteReply = async (req, res, next) => {
    const { id } = req.params;
    try {
        const findedReply = await Reply.findById(id);
        const findedReview = await Review.findById(findedReply.review);
        await Review.updateOne({_id: findedReview._id}, {replyQuantity: findedReview.replyQuantity - 1})
        const response = await Reply.deleteOne({_id: id});
        res.status(200).json({message: 'Delete successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.updateReply = async (req, res, next) => {
    const { id } = req.params;
    const { message, review } = req.body;
    try {
        const Replys = await Reply.updateOne({_id: id}, {
            body: message,
            updateAt: new Date(),
            review
        })
        res.status(200).json({message: 'Update successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}