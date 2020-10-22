const Save = require('../models/Save');
const mongoose = require("mongoose");
const Gym = require('../models/Gym');

exports.getSavesByUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const saves = await Save.find({user: id})
        .populate({ path: 'gym', model: Gym});
        res.status(200).json({saves: saves});
    } catch (error) {
        res.status(500).json(err);
    }
}

exports.addSave = async (req, res, next) => {
    const { gym, user } = req.body;
    try {
        const newSave = new Save({
            _id: new mongoose.Types.ObjectId(),
            gym: gym,
            user: user,
            createAt: new Date()
        })
        newSave.save();
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        res.status(500).json(err);
    }
}

exports.deleteSave = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Save.deleteOne({_id: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({err});
    }
}
