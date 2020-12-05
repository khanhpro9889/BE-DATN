const mongoose = require("mongoose");
const Review = require('../models/Review');
const User = require('../models/User'); 
const Reply = require('../models/Reply');
const Notification = require('../models/Notification');
const Gym = require('../models/Gym');

exports.getReviewsByUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const reviews = await Review.find({author: id}).populate({ path: 'gym', model: Gym }).populate({ path: 'author', model: User});
        res.status(200).json({reviews: reviews});
    } catch (error) {
        console.log(error);
    }
}

exports.getAllReviewsByGym = async (req, res, next) => {
    const { id } = req.params;
    //const { page } = req.query;
    try {
        const reviews = await Review.find({gym: id}).populate({ path: 'author', model: User}) //.limit(page * 5);
        res.status(200).json({reviews: reviews});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.addReview = async (req, res, next) => {
    const { gym, message, rating, user, gymHost } = req.body;
    try {
        const newReview = new Review({
            _id: new mongoose.Types.ObjectId(),
            author: user,
            body: message,
            gym,
            rating,
            createAt: new Date()
        })
        await newReview.save();
        if (user.toString() !== gymHost.toString()) {
            const findedNoti = await Notification.find({gym: gym, type: 1, unread: true});
            var newNoti;
            if (findedNoti.length > 0) {
                await Notification.updateOne({_id: findedNoti[0]._id}, {
                    gym: gym,
                    user: gymHost,
                    type: 1,
                    quantity: findedNoti[0].quantity + 1,
                    unread: true,
                    createAt: new Date()
                })
                req.io.sockets.emit(`notification ${gymHost}`, gymHost);
            } else {
                newNoti = new Notification({
                    _id: new mongoose.Types.ObjectId(),
                    gym: gym,
                    user: gymHost,
                    type: 1,
                    quantity: 1,
                    unread: true,
                    createAt: new Date()
                })
                await newNoti.save();
                req.io.sockets.emit(`notification ${gymHost}`, gymHost);
            }
        }
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteReview = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await Review.deleteOne({_id: id});
        const resp = await Reply.deleteMany({review: id});
        res.status(200).json({message: 'Delete successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.updateReview = async (req, res, next) => {
    const { id } = req.params;
    const { rating, message, gym } = req.body;
    try {
        const reviews = await Review.updateOne({_id: id}, {
            rating,
            body: message,
            updateAt: new Date(),
            gym
        })
        res.status(200).json({message: 'Update successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}