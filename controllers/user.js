const User = require('../models/User');
//const mongoose = require("mongoose");
const Province = require("../models/Province");
const Review = require("../models/Review");
const Reply = require("../models/Reply");
const Gym = require('../models/Gym');
const Conversation = require("../models/Conversation");
const Message = require('../models/Message');
const Token = require('../models/Token');
const Social = require('../models/Social');
const Save = require('../models/Save');
const Notification = require('../models/Notification');

exports.getUser = async (req, res, next) => {
    const { uid } = req.params;
    try {
        const user = await User.findById(uid).populate({ path: 'city', model: Province });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.changeRoleUser = async (req, res, next) => {
    const { uid } = req.params;
    const { role } = req.body;
    console.log(role);
    try {
        await User.updateOne({_id: uid}, {
            role: role
        });
        res.status(200).json({message: 'Update successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getAllUser = async (req, res, next) => {
    const { page, search } = req.query;
    const perPage = 7;
    try {
        const totalUsers = await User.find().populate({ path: 'city', model: Province });
        var users = [];
        if (search) {
            users = await User.find({name: new RegExp('\w*' + search + '\w*', 'gi')}).populate({ path: 'city', model: Province });
        } else {
            users = await User.find().populate({ path: 'city', model: Province });
        }
        var reviewsList = [];
        var repliesList = [];
        var gymsList = [];
        for (const u of users) {
            const reviews = await Review.find({author: u._id});
            const replies = await Reply.find({author: u._id});
            const gyms = await Gym.find({createBy: u._id});
            reviewsList.push(reviews.length);
            repliesList.push(replies.length);
            gymsList.push(gyms.length);
        }
        var final = users.map((item, index) => {
            return {
                ...item,
                reviews: reviewsList[index],
                replies: repliesList[index],
                gyms: gymsList[index]
            }
        }).map(item => {
            return {
                ...item._doc,
                reviews: item.reviews,
                replies: item.replies,
                gyms: item.gyms,
            }
        })
        const totalPage = Math.ceil(final.length / perPage);
        const start = page ? (page - 1) * perPage : 0;
        const end = page ? (page - 1) * perPage + perPage : perPage;
        final = final.slice(start, end);
        return res.status(200).json({users: final, totalPage: totalPage, currentPage: parseInt(page) || 1, totalUser: totalUsers.length});
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

exports.updateUser = async (req, res, next) => {
    const {name, phone, about, work, city} = req.body;
    const { uid } = req.params;
    const image = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;
    console.log(city);
    try {
        if (image) {
            await User.updateOne({_id: uid}, {
                name,
                about,
                work,
                phone,
                city: city === '-1' ? null : city,
                profileImg: image 
            })
        } else {
            await User.updateOne({_id: uid}, {
                name,
                phone,
                about,
                work,
                city: city === '-1' ? null : city,
            })
        }
        
        const user = await User.findById(uid).populate({ path: 'city', model: Province});
        res.status(200).json({message: 'Update successfully', user: user});
    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}

exports.deleteUser = async (req, res, next) => {
    const { uid } = req.params;
    try {
        const user = await User.findById(uid);
        await Social.deleteOne({_id: user.social});
        await Reply.deleteMany({author: uid});
        const reviews = await Review.find({author: uid});
        for (const r of reviews) {
            await Reply.deleteMany({review: r._id});
        }
        await Review.deleteMany({author: uid});
        const con1 = Conversation.find({user1: uid});
        if (con1.length > 0) {
            for (const c of con1) {
                await Message.deleteMany(c.user2);
            }
        }
        const con2 = Conversation.find({user2: uid});
        if (con2.length > 0) {
            for (const c of con2) {
                await Message.deleteMany(c.user1);
            }
        }
        await Notification.deleteMany({user: uid});
        await Conversation.deleteMany({user1: uid});
        await Conversation.deleteMany({user2: uid});
        await Message.deleteMany({sender: uid});
        await Message.deleteMany({receiver: uid});
        await User.deleteOne({_id: uid});
        await Save.deleteMany({user: uid});
        await Token.deleteMany({uid: uid});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}
