const User = require('../models/User');
//const mongoose = require("mongoose");
const Province = require("../models/Province");

exports.getUser = async (req, res, next) => {
    const { uid } = req.params ;
    try {
        const user = await User.findById(uid).populate({ path: 'city', model: Province });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.updateUser = async (req, res, next) => {
    const {name, phone, isHidden, about, work, city} = req.body;
    const { uid } = req.params;
    const image = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

    try {
        if (image) {
            await User.updateOne({_id: uid}, {
                name,
                about,
                work,
                phone,
                isHidden,
                city,
                profileImg: image 
            })
        } else {
            await User.updateOne({_id: uid}, {
                name,
                phone,
                isHidden,
                about,
                work,
                city
            })
        }
        
        const user = await User.findById(uid);
        res.status(200).json({message: 'Update successfully', user: user});
    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}